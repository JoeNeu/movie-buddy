package at.webengineering.backend

import at.webengineering.backend.dtos.AccountCreationDto
import at.webengineering.backend.services.AccountService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.boot.runApplication
import org.springframework.context.event.EventListener


@SpringBootApplication
class BackendApplication(
    private val accountService: AccountService
) {
    val logger: Logger = LoggerFactory.getLogger(BackendApplication::class.java)

    @EventListener(ApplicationReadyEvent::class)
    fun fillDatabase() {
        try {
            if (accountService.findAll().isEmpty()) {
                logger.info("Add Administrator")
                accountService.createAdministrator(
                    AccountCreationDto(
                        username = "admin",
                        password = "admin",
                        firstname = "firstname",
                        lastname = "lastname"
                    )
                )
            }
        } catch (e: Exception) {
            logger.warn("Initial car import failed")
        }
    }
}

fun main(args: Array<String>) {
    runApplication<BackendApplication>(*args)
}
