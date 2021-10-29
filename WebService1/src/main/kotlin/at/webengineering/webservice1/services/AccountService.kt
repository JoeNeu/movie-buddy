package at.webengineering.webservice1.services

import at.webengineering.webservice1.dtos.AccountCreationDto
import at.webengineering.webservice1.dtos.AccountDto
import at.webengineering.webservice1.entities.Account
import at.webengineering.webservice1.exceptions.InvalidLoginCredentialsException
import at.webengineering.webservice1.exceptions.UsernameAlreadyExistsException
import at.webengineering.webservice1.mapper.AccountMapper
import at.webengineering.webservice1.repositories.IAccountRepository
import at.webengineering.webservice1.utils.HashUtil.hash
import at.webengineering.webservice1.dtos.PasswordChangeDto
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

    fun login(loginDto: at.webengineering.webservice1.dtos.LoginDto) {
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

    fun deleteAccountByUsername(username: String){
        accountRepository.deleteAccountByUsername(username).also {
            logger.info("Deleted Account with Username: ${username}")
        }
    }

    fun findAll(): List<AccountDto> = accountRepository.findAll().map{ account -> accountMapper.toDto(account)}

    fun findOne(id: UUID): AccountDto {
        return accountRepository.findById(id).map{ account: Account -> accountMapper.toDto(account)}.get()
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

    private fun usernameAlreadyExists(username: String): Boolean = accountRepository.findAccountByUsername(username) != null
}
