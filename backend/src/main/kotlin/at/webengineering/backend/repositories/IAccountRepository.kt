package at.webengineering.backend.repositories

import at.webengineering.backend.entities.Account
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Transactional
interface IAccountRepository : JpaRepository<Account, UUID> {

    fun findAccountByUsername(username: String): Account?

    fun deleteAccountByUsername(username: String)
}
