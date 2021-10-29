package at.webengineering.webservice1.dtos

data class PasswordChangeDto (
        val username: String,
        val newPassword: String
)