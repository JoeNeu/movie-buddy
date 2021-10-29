package at.webengineering.webservice1.dtos

import java.util.*

data class AccountDto(
        val id: UUID,
        val username: String,
        val firstname: String,
        val lastname: String,
        var token: String?,
        var isAdministrator: Boolean
        )
