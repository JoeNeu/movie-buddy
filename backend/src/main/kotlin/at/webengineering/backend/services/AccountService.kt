package at.webengineering.backend.services

import at.webengineering.backend.dtos.*
import at.webengineering.backend.entities.Account
import at.webengineering.backend.entities.Message
import at.webengineering.backend.exceptions.InvalidLoginCredentialsException
import at.webengineering.backend.exceptions.UsernameAlreadyExistsException
import at.webengineering.backend.mapper.AccountMapper
import at.webengineering.backend.repositories.IAccountRepository
import at.webengineering.backend.utils.HashUtil.hash
import at.webengineering.backend.entities.VideoProduction
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.*

@Service
class AccountService(
    private val accountRepository: IAccountRepository,
    private val accountMapper: AccountMapper
) {

    val logger: Logger = LoggerFactory.getLogger(AccountService::class.java)

    fun login(loginDto: at.webengineering.backend.dtos.LoginDto) {
        if (!passwordCorrect(loginDto.username, loginDto.password))
            throw InvalidLoginCredentialsException()
    }

    fun passwordCorrect(username: String, password: String): Boolean {
        return when (val account = accountRepository.findAccountByUsername(username)) {
            null -> false
            else -> account.password == hash(password)
        }
    }

    fun changePassword(passwordChangeDto: PasswordChangeDto) {
        val account = accountRepository.findAccountByUsername(passwordChangeDto.username)
            ?: throw NullPointerException()

        account.password = hash(passwordChangeDto.newPassword)
        accountRepository.save(account).also {
            logger.info("Password changed successfully: $it")
        }
    }

    fun createAccount(accountCreationDto: AccountCreationDto) {
        if (usernameAlreadyExists(accountCreationDto.username)) {
            throw UsernameAlreadyExistsException()
        }

        val entity = accountMapper.mapToEntityAndHashPassword(accountCreationDto)
        accountRepository.save(entity).also {
            logger.info("New Account created: $it")
        }
    }

    fun deleteAccount(id: UUID) {
        accountRepository.deleteById(id).also {
            logger.info("Deleted Account with UserId: ${id}")
        }
    }

    fun deleteAccountByUsername(username: String) {
        accountRepository.deleteAccountByUsername(username).also {
            logger.info("Deleted Account with Username: ${username}")
        }
    }

    fun findAll(): List<AccountDto> = accountRepository.findAll().map { account -> accountMapper.toDto(account) }

    fun findOneAccountDto(id: UUID): AccountDto {
        return accountRepository.findById(id).map { account: Account -> accountMapper.toDto(account) }.get()
    }

    fun findOneAccount(id: UUID): Account {
        return accountRepository.findById(id).get()
    }

    fun getUserDtoByUsername(username: String): AccountDto {
        return accountMapper.mapToDtoAndGenerateJwt(
            accountRepository.findAccountByUsername(username) ?: throw NullPointerException()
        )
    }

    fun createAdministrator(accountCreationDto: AccountCreationDto) {
        if (usernameAlreadyExists(accountCreationDto.username)) {
            throw UsernameAlreadyExistsException()
        }

        val entity = accountMapper.mapToEntityAndHashPassword(accountCreationDto)
        entity.isAdministrator = true
        accountRepository.save(entity).also {
            logger.info("New Account created: $it")
        }
    }

    private fun usernameAlreadyExists(username: String): Boolean =
        accountRepository.findAccountByUsername(username) != null

    fun addFriend(account: Account, id: UUID) {
        account.friends.add(id)
        accountRepository.save(account)
    }

    fun removeFriend(account: Account, id: UUID) {
        account.friends.remove(id)
        accountRepository.save(account)
    }

    fun getAllFriends(account: Account): List<AccountDto> {
        return accountRepository.findAllById(account.friends).map { acc -> accountMapper.toDto(acc) }
    }

    fun addToFavorites(account: Account, videoProduction: VideoProductionDto) {
        val vidProd = VideoProduction(videoProduction.movieId, videoProduction.productionType, videoProduction.uid)
        account.favorites.add(vidProd)
        accountRepository.save(account)
    }

    fun removeFromFavorites(account: Account, videoProduction: VideoProductionDto) {
        val favoriteToRemove = account.favorites.find { fav -> fav.productionType == videoProduction.productionType && fav.movieId == videoProduction.movieId }
        account.favorites.remove(favoriteToRemove)
        accountRepository.save(account)
    }

    fun getAllFavorites(account: Account): List<VideoProductionDto> {
        return account.favorites.toList().map { vid -> VideoProductionDto(vid.movieId, vid.productionType, vid.uid) }
    }

    fun getAllFavoritesFromFriend(id: UUID): List<VideoProductionDto> {
        return getAllFavorites(findOneAccount(id))
    }

    fun addToWatchlist(account: Account, videoProduction: VideoProductionDto) {
        val vidProd = VideoProduction(videoProduction.movieId, videoProduction.productionType, videoProduction.uid)
        account.watchlist.add(vidProd)
        accountRepository.save(account)
    }

    fun removeFromWatchlist(account: Account, videoProduction: VideoProductionDto) {
        val favoriteToRemove = account.watchlist.find { fav -> fav.productionType == videoProduction.productionType && fav.movieId == videoProduction.movieId }
        account.watchlist.remove(favoriteToRemove)
        accountRepository.save(account)
    }

    fun getAllWatchlistItems(account: Account): List<VideoProductionDto> {
        return account.watchlist.toList().map { vid -> VideoProductionDto(vid.movieId, vid.productionType, vid.uid) }
    }

    fun getAllWatchlistItemsFromFriend(id: UUID): List<VideoProductionDto> {
        return getAllWatchlistItems(findOneAccount(id))
    }

    fun getAllMessages(account: Account): List<MessageDto> {
        return account.messages.toList().map { message -> MessageDto(message.sender, message.receiver, message.text, message.movieId) }
    }

    fun saveMessage(account: Account, messageDto: MessageDto) {
        val message = Message(sender = messageDto.sender, receiver = messageDto.receiver, text = messageDto.text, movieId = messageDto.movieId ?: 0)
        account.messages.add(message)
        accountRepository.save(account)

        val receiver = findOneAccount(UUID.fromString(messageDto.receiver))
        receiver.messages.add(message)
        accountRepository.save(receiver)
    }
}
