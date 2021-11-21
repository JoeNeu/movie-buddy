package at.webengineering.backend.entities

import org.hibernate.annotations.GenericGenerator
import java.util.*
import javax.persistence.*

@Entity
data class Account(

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    var id: UUID?,

    @Column(nullable = false)
    var username: String,

    @Column(nullable = false)
    var password: String,

    @Column(nullable = false)
    var firstname: String,

    @Column(nullable = false)
    var lastname: String,

    @Column(nullable = false)
    var isAdministrator: Boolean,

    @ElementCollection
    var friends: MutableList<UUID>,

    @ElementCollection
    @CollectionTable(
        joinColumns = [JoinColumn(name = "ACCOUNT_ID")]
    )
    var favorites: MutableList<VideoProduction>,

    @ElementCollection
    @CollectionTable(
        joinColumns = [JoinColumn(name = "ACCOUNT_ID")]
    )
    var watchlist: MutableList<VideoProduction>,

    @ElementCollection
    @CollectionTable(
        joinColumns = [JoinColumn(name = "ACCOUNT_ID")]
    )
    var messages: MutableList<Message>,
)
