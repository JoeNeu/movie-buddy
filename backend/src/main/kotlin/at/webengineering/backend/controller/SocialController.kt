package at.webengineering.backend.controller

import at.webengineering.backend.dtos.AccountDto
import at.webengineering.backend.exceptions.AccountNotFoundException
import at.webengineering.backend.exceptions.TokenNotValidException
import at.webengineering.backend.services.AccountService
import at.webengineering.backend.services.JwtTokenService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/social")
class SocialController(
    val accountService: AccountService,
    val jwtTokenService: JwtTokenService
) {


}