package at.webengineering.backend.entities

import javax.persistence.Column
import javax.persistence.Embeddable

@Embeddable
data class Message(

    @Column(nullable = false)
    var sender: String,

    @Column(nullable = false)
    var receiver: String,

    @Column(nullable = false)
    var text: String,

    @Column(nullable = true)
    var movieId: Int?,

    @Column(nullable = true)
    var type: String?,
)