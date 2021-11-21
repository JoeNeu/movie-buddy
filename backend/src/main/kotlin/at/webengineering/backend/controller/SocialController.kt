package at.webengineering.backend.controller

import at.webengineering.backend.dtos.MessageDto
import at.webengineering.backend.dtos.VideoProductionDto
import at.webengineering.backend.entities.Rating
import at.webengineering.backend.exceptions.AccountNotFoundException
import at.webengineering.backend.exceptions.TokenNotValidException
import at.webengineering.backend.services.AccountService
import at.webengineering.backend.services.JwtTokenService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.util.*
import kotlin.NoSuchElementException

@RestController
@RequestMapping("/social")
class SocialController(
    val accountService: AccountService,
    val jwtTokenService: JwtTokenService
) {
    @GetMapping("/favorites")
    fun getAllFavoritesFromFriend(
        @RequestHeader("token") token: String,
        @RequestParam("id") id: String
    ): ResponseEntity<List<VideoProductionDto>> {
        return try {
            val account = jwtTokenService.getAccountFromToken(token)
            if (account.friends.indexOf(UUID.fromString(id)) == -1) throw Exception("$id is not found in your friend list")
            val favoritesList = accountService.getAllFavoritesFromFriend(UUID.fromString(id))
            ResponseEntity.ok().body(favoritesList)
        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @GetMapping("/watchlist")
    fun getAllWatchlistItemsFromFriend(
        @RequestHeader("token") token: String,
        @RequestParam("id") id: String
    ): ResponseEntity<List<VideoProductionDto>> {
        return try {
            val account = jwtTokenService.getAccountFromToken(token)
            if (account.friends.indexOf(UUID.fromString(id)) == -1) throw Exception("$id is not found in your friend list")
            val favoritesList = accountService.getAllWatchlistItemsFromFriend(UUID.fromString(id))
            ResponseEntity.ok().body(favoritesList)
        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @GetMapping("/messages")
    fun getAllMessages(
        @RequestHeader("token") token: String
    ): ResponseEntity<List<MessageDto>> {
        return try {
            val account = jwtTokenService.getAccountFromToken(token)
            val messageList = accountService.getAllMessages(account)
            ResponseEntity.ok().body(messageList)
        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @PostMapping("/messages")
    fun postMessage(
        @RequestHeader("token") token: String,
        @RequestBody messageDto: MessageDto
    ): ResponseEntity<String> {
        return try {
            val account = jwtTokenService.getAccountFromToken(token)
            if (account.id != UUID.fromString(messageDto.sender)) throw Exception("You are not the sender of this request")
            accountService.saveMessage(account, messageDto)
            ResponseEntity.ok().body("")
        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @GetMapping("/rating")
    fun getRating(
        @RequestParam("id") id: Int
    ): ResponseEntity<Rating> {
        return try {
            val rating = try {
                accountService.getRating(id)
            } catch (e: NoSuchElementException) {
                Rating(id, 0)
            }
            ResponseEntity.ok().body(rating)
        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

    @GetMapping("/rating/add")
    fun increaseRating(
        @RequestParam("id") id: Int
    ): ResponseEntity<Rating> {
        return try {
            var rating = try {
                accountService.getRating(id)
            } catch (e: NoSuchElementException) {
                Rating(id, 0)
            }
            rating = accountService.increaseRating(rating)
            ResponseEntity.ok().body(rating)
        } catch (e: TokenNotValidException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: AccountNotFoundException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }

}