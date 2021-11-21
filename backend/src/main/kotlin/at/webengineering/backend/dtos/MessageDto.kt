package at.webengineering.backend.dtos

data class MessageDto (
    val sender: String,
    val receiver: String,
    val text: String,
    val movieId: Int?,
    val type: String?
)