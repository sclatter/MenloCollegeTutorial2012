SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';


-- -----------------------------------------------------
-- Table `newTuturialQuizzes`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `newTuturialQuizzes` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `newTutorialQuizQuestions`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS newTutorialQuizQuestions` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `quizId` INT NOT NULL ,
  `name` VARCHAR(45) NOT NULL ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC, `quizId` ASC) ,
  INDEX `quiz_id_idx` (`quizId` ASC) ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  CONSTRAINT `quizId`
    FOREIGN KEY (`quizId` )
    REFERENCES `tutorial`.`newTuturialQuizzes` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `newTutorialQuizResults`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `newTutorialQuizResults` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `questionId` INT NOT NULL ,
  `isCorrect` BINARY NOT NULL ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `questionId_idx` (`questionId` ASC) ,
  CONSTRAINT `questionId`
    FOREIGN KEY (`questionId` )
    REFERENCES `tutorial`.`newTutorialQuizQuestions` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `newTutorialQuizPassers`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS newTutorialQuizPassers` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(512) NOT NULL ,
  `email` VARCHAR(512) NOT NULL ,
  `quizId` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `quizId_idx` (`quizId` ASC) ,
  CONSTRAINT `quizId`
    FOREIGN KEY (`quizId` )
    REFERENCES `tutorial`.`newTuturialQuizzes` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
