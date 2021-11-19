package at.webengineering.backend.controller

import at.webengineering.backend.dtos.*
import at.webengineering.backend.entities.VideoProduction
import at.webengineering.backend.exceptions.AccountNotFoundException
import at.webengineering.backend.exceptions.InvalidLoginCredentialsException
import at.webengineering.backend.exceptions.TokenNotValidException
import at.webengineering.backend.exceptions.UsernameAlreadyExistsException
import at.webengineering.backend.services.AccountService

import at.webengineering.backend.services.JwtTokenService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.util.*

@CrossOrigin(origins = ["http://localhost:4200"])
@RestController
@RequestMapping("/accounts")
class AccountController(
    val accountService: AccountService,
    val jwtTokenService: JwtTokenService
) {

    @GetMapping
    fun getAllAccounts(
        @RequestHeader("token") token: String
    ): ResponseEntity<List<AccountDto>> {
        return try {
            jwtTokenService.getAccountFromToken(token)
            val accountList = accountService.findAll()
            ResponseEntity.ok().body(accountList)

        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @GetMapping("/{id}")
    fun getAccount(@RequestHeader("token") token: String, @PathVariable id: UUID): ResponseEntity<AccountDto> {
        return try {
            jwtTokenService.getAccountFromToken(token)
            val accountDto = accountService.findOne(id)
            ResponseEntity.ok().body(accountDto)

        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }


    @PostMapping
    fun createAccount(@RequestBody accountCreation: AccountCreationDto): ResponseEntity<AccountDto> {
        return try {
            accountService.createAccount(accountCreation)
            val user = accountService.getUserDtoByUsername(accountCreation.username)
            ResponseEntity.ok().body(user)

        } catch (e: UsernameAlreadyExistsException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @PostMapping("/login")
    fun login(@RequestBody loginDto: LoginDto): ResponseEntity<AccountDto> {
        return try {
            accountService.login(loginDto)
            val user = accountService.getUserDtoByUsername(loginDto.username)
            ResponseEntity.ok().body(user)

        } catch (e: InvalidLoginCredentialsException) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @DeleteMapping("/{id}")
    fun deleteAccount(
        @RequestHeader("token") token: String,
        @PathVariable id: UUID
    ): ResponseEntity<*> {
        return try {
            jwtTokenService.getAccountFromToken(token)
            accountService.deleteAccount(id)
            ResponseEntity.ok().body("")

        } catch (e: TokenNotValidException) {
            ResponseEntity(e.message, HttpStatus.FORBIDDEN)
        } catch (e: Exception) {
            ResponseEntity(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @PutMapping("/change-password")
    fun changePassword(
        @RequestHeader("token") token: String,
        @RequestBody passwordChangeDto: PasswordChangeDto
    ): ResponseEntity<*> {
        return try {
            jwtTokenService.validateUserToken(token, passwordChangeDto.username)
            accountService.changePassword(passwordChangeDto)
            ResponseEntity.ok().body("")

        } catch (e: TokenNotValidException) {
            ResponseEntity(e.message, HttpStatus.FORBIDDEN)
        } catch (e: Exception) {
            ResponseEntity(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @GetMapping("/friends")
    fun getAllFriends(
        @RequestHeader("token") token: String
    ): ResponseEntity<List<AccountDto>> {
        return try {
            val account = jwtTokenService.getAccountFromToken(token)
            val friendList = accountService.getAllFriends(account)
            ResponseEntity.ok().body(friendList)

        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @PutMapping("/friends/add")
    fun addFriend(
        @RequestHeader("token") token: String,
        @RequestBody id: String
    ): ResponseEntity<String> {
        return try {
            val account = jwtTokenService.getAccountFromToken(token)
            accountService.addFriend(account, UUID.fromString(id))
            ResponseEntity.ok().body("")

        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @PutMapping("/friends/remove")
    fun removeFriend(
        @RequestHeader("token") token: String,
        @RequestBody id: String
    ): ResponseEntity<String> {
        return try {
            val account = jwtTokenService.getAccountFromToken(token)
            accountService.removeFriend(account, UUID.fromString(id))
            ResponseEntity.ok().body("")

        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @GetMapping("/favorites")
    fun getAllFavorites(
            @RequestHeader("token") token: String
    ): ResponseEntity<List<VideoProductionDto>> {
        return try {
            val account = jwtTokenService.getAccountFromToken(token)
            val favoritesList = accountService.getAllFavorites(account)
            ResponseEntity.ok().body(favoritesList)
        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @PutMapping("/favorites/add")
    fun addToFavorites(
            @RequestHeader("token") token: String,
            @RequestBody videoProduction: VideoProductionDto
    ): ResponseEntity<String> {
        return try {
            val account = jwtTokenService.getAccountFromToken(token)
            accountService.addToFavorites(account, videoProduction)
            ResponseEntity.ok().body("")

        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @PutMapping("/favorites/remove")
    fun removeFromFavorites(
            @RequestHeader("token") token: String,
            @RequestBody videoProduction: VideoProductionDto
    ): ResponseEntity<String> {
        return try {
            val account = jwtTokenService.getAccountFromToken(token)
            accountService.removeFromFavorites(account, videoProduction)
            ResponseEntity.ok().body("")

        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @GetMapping("/watchlist")
    fun getAllWatchlistItems(
            @RequestHeader("token") token: String
    ): ResponseEntity<List<VideoProductionDto>> {
        return try {
            val account = jwtTokenService.getAccountFromToken(token)
            val watchlist = accountService.getAllWatchlistItems(account)
            ResponseEntity.ok().body(watchlist)
        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @PutMapping("/watchlist/add")
    fun addToWatchlist(
            @RequestHeader("token") token: String,
            @RequestBody videoProduction: VideoProductionDto
    ): ResponseEntity<String> {
        return try {
            val account = jwtTokenService.getAccountFromToken(token)
            accountService.addToWatchlist(account, videoProduction)
            ResponseEntity.ok().body("")

        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @PutMapping("/watchlist/remove")
    fun removeFromWatchlist(
            @RequestHeader("token") token: String,
            @RequestBody videoProduction: VideoProductionDto
    ): ResponseEntity<String> {
        return try {
            val account = jwtTokenService.getAccountFromToken(token)
            accountService.removeFromWatchlist(account, videoProduction)
            ResponseEntity.ok().body("")

        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }
}
