package at.webengineering.backend.services

import at.webengineering.backend.entities.Account
import at.webengineering.backend.exceptions.AccountNotFoundException
import at.webengineering.backend.exceptions.TokenNotValidException
import at.webengineering.backend.repositories.IAccountRepository
import io.fusionauth.jwt.Signer
import io.fusionauth.jwt.Verifier
import io.fusionauth.jwt.domain.JWT
import io.fusionauth.jwt.hmac.HMACSigner
import io.fusionauth.jwt.hmac.HMACVerifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.*

@Service
class JwtTokenService(
    private val accountRepository: IAccountRepository
) {

    @Value("\${token.privateKey}")
    val privateKey: String? = null

    @Value("\${token.issuer}")
    val issuer: String? = null

    @Value("\${token.expirationTime}")
    val expirationTime: Long = 0

    fun buildJwt(uuid: UUID): String {
        val signer: Signer = HMACSigner.newSHA256Signer(privateKey)
        val jwt = JWT().setIssuer(issuer)
            .setIssuedAt(ZonedDateTime.now(ZoneOffset.UTC))
            .setSubject(uuid.toString())
            .setExpiration(ZonedDateTime.now(ZoneOffset.UTC).plusMinutes(expirationTime))
        return JWT.getEncoder().encode(jwt, signer)
    }

    fun recoverJWT(encodedJWT: String): JWT {
        return try {
            val verifier: Verifier = HMACVerifier.newVerifier(privateKey)
            JWT.getDecoder().decode(encodedJWT, verifier)
        } catch (e: Exception) {
            throw TokenNotValidException()
        }
    }

    fun validateUserToken(token: String, username: String) {
        val jwt = recoverJWT(token)
        val uuid = accountRepository.findAccountByUsername(username).let { account -> account?.id.toString() }
        if (jwt.subject != uuid) throw TokenNotValidException()
    }

    fun getAccountFromToken(token: String): Account {
        val jwt = recoverJWT(token)
        return accountRepository.findByIdOrNull(UUID.fromString(jwt.subject))
            ?: throw AccountNotFoundException()
    }
}
