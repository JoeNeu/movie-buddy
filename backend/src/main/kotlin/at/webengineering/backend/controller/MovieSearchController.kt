package at.webengineering.backend.controller

import at.webengineering.backend.dtos.MovieSearchResultDto
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@CrossOrigin(origins = ["http://localhost:4200"])
@RestController
@RequestMapping("/movie-search")
class MovieSearchController {

    @GetMapping
    fun getAllAccounts(@RequestParam("title") title: String
    ): ResponseEntity<MutableList<MovieSearchResultDto>> {
        try {
            val testResult = MovieSearchResultDto("bla bla title")
            val resultList: MutableList<MovieSearchResultDto> = ArrayList()
            resultList.add(testResult)

            return ResponseEntity.ok().body(resultList)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
    }
}
