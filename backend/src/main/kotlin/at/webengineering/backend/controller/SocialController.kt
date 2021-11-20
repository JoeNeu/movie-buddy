package at.webengineering.backend.controller

import at.webengineering.backend.dtos.VideoProductionDto
import at.webengineering.backend.exceptions.AccountNotFoundException
import at.webengineering.backend.exceptions.TokenNotValidException
import at.webengineering.backend.services.AccountService
import at.webengineering.backend.services.JwtTokenService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.util.*

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

}