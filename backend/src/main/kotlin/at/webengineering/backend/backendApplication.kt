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
                        firstname = "Peter",
                        lastname = "Administrator"
                    )
                )
                accountService.createAccount(
                    AccountCreationDto(
                        username = "Movie3000",
                        password = "admin",
                        firstname = "Martin",
                        lastname = "Huber"
                    )
                )
                accountService.createAccount(
                    AccountCreationDto(
                        username = "SuperSpecial5000",
                        password = "admin",
                        firstname = "Marc",
                        lastname = "Heinz"
                    )
                )
                accountService.createAccount(
                    AccountCreationDto(
                        username = "xXxNoScope360xXx",
                        password = "admin",
                        firstname = "Johannes",
                        lastname = "Müller"
                    )
                )
                accountService.createAccount(
                    AccountCreationDto(
                        username = "Filmkritiker",
                        password = "admin",
                        firstname = "Sir. Albert",
                        lastname = "Von Hausen"
                    )
                )
                accountService.createAccount(
                    AccountCreationDto(
                        username = "Nice",
                        password = "admin",
                        firstname = "Herbert",
                        lastname = "X"
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
