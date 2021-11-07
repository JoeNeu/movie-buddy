package at.webengineering.backend.dtos

data class AccountCreationDto(
    val username: String,
    val password: String,
    val firstname: String,
    val lastname: String
)
