package at.webengineering.backend.entities

import javax.persistence.Column
import javax.persistence.Embeddable


@Embeddable
data class VideoProduction(

        @Column(nullable = false)
        var movieId: Int,

        @Column(nullable = false)
        var productionType: String,

        @Column(nullable = false)
        var uid: String,
)
