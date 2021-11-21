package at.webengineering.backend.entities

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class Rating(

    @Id
    var movieId: Int,

    @Column(nullable = false)
    var count: Int,
)