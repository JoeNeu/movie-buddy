package at.webengineering.backend.controller

import at.webengineering.backend.dtos.*
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

@RestController
@RequestMapping("/accounts")
class AccountController(
        val accountService: AccountService,
        val jwtTokenService: JwtTokenService
) {

    @GetMapping
    fun getAllAccounts (@RequestHeader("token") token: String
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
    fun getAccount(@RequestHeader("token") token: String,  @PathVariable id: UUID): ResponseEntity<AccountDto> {
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
    fun createAccount(@RequestBody accountCreation: AccountCreationDto): ResponseEntity<*> {
        return try {
            accountService.createAccount(accountCreation)
            val user = accountService.getUserDtoByUsername(accountCreation.username)
            ResponseEntity.ok().body(user)

        } catch (e: UsernameAlreadyExistsException) {
            ResponseEntity(e.message, HttpStatus.BAD_REQUEST)
        } catch (e: Exception) {
            ResponseEntity(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @PostMapping("/login")
    fun login(@RequestBody loginDto: LoginDto): ResponseEntity<*> {
        return try {
            accountService.login(loginDto)
            val user = accountService.getUserDtoByUsername(loginDto.username)
            ResponseEntity.ok().body(user)

        } catch (e: InvalidLoginCredentialsException) {
            ResponseEntity(e.message, HttpStatus.UNAUTHORIZED)
        } catch (e: Exception) {
            ResponseEntity(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @DeleteMapping("/{id}")
    fun deleteAccount(
            @RequestHeader("token") token: String,
            @PathVariable id: UUID): ResponseEntity<*> {
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
}
