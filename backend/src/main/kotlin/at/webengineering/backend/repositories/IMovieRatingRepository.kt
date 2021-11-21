package at.webengineering.backend.repositories

import at.webengineering.backend.entities.Rating
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.transaction.annotation.Transactional

@Transactional
interface IMovieRatingRepository : JpaRepository<Rating, Int>