package at.webengineering.backend.mapper

import at.webengineering.backend.dtos.AccountCreationDto
import at.webengineering.backend.dtos.AccountDto
import at.webengineering.backend.entities.Account
import at.webengineering.backend.services.JwtTokenService
import at.webengineering.backend.utils.HashUtil.hash
import org.springframework.stereotype.Service

@Service
class AccountMapper(
    val jwtTokenService: JwtTokenService
) {

    fun mapToEntityAndHashPassword(accountCreationDto: AccountCreationDto): Account {
        return Account(
            id = null,
            username = accountCreationDto.username,
            password = hash(accountCreationDto.password),
            firstname = accountCreationDto.firstname,
            lastname = accountCreationDto.lastname,
            isAdministrator = false,
            friends = mutableListOf(),
            favorites = mutableListOf(),
            watchlist = mutableListOf()
        )
    }

    fun mapToDtoAndGenerateJwt(account: Account): AccountDto {
        return AccountDto(
            account.id ?: throw java.lang.NullPointerException(),
            account.username,
            account.firstname,
            account.lastname,
            jwtTokenService.buildJwt(account.id ?: throw NullPointerException("account_id should never be null")),
            account.isAdministrator
        )
    }

    fun toDto(account: Account): AccountDto {
        return AccountDto(
            account.id ?: throw java.lang.NullPointerException(),
            account.username,
            account.firstname,
            account.lastname,
            null,
            account.isAdministrator
        )
    }
}
