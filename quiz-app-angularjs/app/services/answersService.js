/**
 * Created by INNA on 18.04.2017.
 */
app.service('answersService', function () {
    let scoredPoints = 0;
    this.compareAnswers = function (allQuestions, allAnswers) {
        for (let i = 0; i < allQuestions.length; i++) {
            let matchCounter = 0;
            let checkedCounter = 0;
                for (let j = 0; j < 4; j++) {
                    if (allAnswers[i][j]) {
                        checkedCounter++;
                    }
                    if (allAnswers[i][j]
                        && allQuestions[i].options[j].isCorrect === allAnswers[i][j]) {
                        matchCounter++;
                    }
                }
                if (matchCounter === 1 && checkedCounter === 1) {
                    scoredPoints += 1;
                }
        }
        return scoredPoints;
    };

});