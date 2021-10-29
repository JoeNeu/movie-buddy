package at.webengineering.backend.dtos

data class PasswordChangeDto (
        val username: String,
        val newPassword: String
)