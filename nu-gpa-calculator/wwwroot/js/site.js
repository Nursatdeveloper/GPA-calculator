$(document).ready(function () {
    renderCourseList();
    $("#gpa-calculator-form-component").hide();
    $("#add-course-component-error").hide();
    $("#final-exam").hide();
    $("#mid-exam").hide();
    $("#quiz").hide();
    $("#assignment").hide();
    $("#lab").hide();
    $("#participation").hide();

    $("#grading-categories-percentages").hide();
    $("#result-row").hide();

    //initializing popover
    $('[data-bs-toggle="popover"]').popover();
})

// Function adds course to localstorage
function addCourse() {
    var course = $("#add-course-input").val();
    if (course == '') {
        $("#add-course-component-error").show();
        $("#add-course-component-error-text").text("Please enter the course name!");
    }
    else {
        var coursesArray = JSON.parse(localStorage.getItem("Courses"));

        if (coursesArray == null) {
            coursesArray = [course];
        } else if (coursesArray.length == 0) {
            coursesArray[0] = course;
        } else {
            var newCourseIndex = coursesArray.length;
            coursesArray[newCourseIndex] = course;
        }
        localStorage.setItem("Courses", JSON.stringify(coursesArray));
        $("#add-course-input").val('');
        renderCourseList();
    }
}

function closeError(elemId) {
    $(`#${elemId}`).hide();
}

function deleteCourse(index) {
    $("#gpa-calculator-form-component").hide();
    var coursesArray = JSON.parse(localStorage.getItem("Courses"));
    var newCoursesArray = coursesArray.filter(item => item != coursesArray[index]);
    localStorage.setItem("Courses", JSON.stringify(newCoursesArray));
    reload()
    renderCourseList();
}

function emptyGpaCalculatorForm() {

}

function removeCategory(elemId) {
    var categories = JSON.parse(localStorage.getItem("Categories"))
    var filteredCategories = categories.filter(elem => elem != elemId);
    localStorage.setItem("Categories", JSON.stringify(filteredCategories));
    $(`#${elemId}`).hide();
}

function showMessage(message) {

    var toastLiveExample = document.getElementById('liveToast')
    var toast = new bootstrap.Toast(toastLiveExample)
    $(".square").addClass("square-red");
    $(".toast-body").text(message);
    toast.show()

}
function reload() {
    window.location.reload();
}
function showGpaCalculator(course) {
    var isRendered = $("#is-gpa-calculator-form-rendered").val();
    if (isRendered == "false") {
        localStorage.removeItem("Categories");
        $("#is-gpa-calculator-form-rendered").val('true');
        $("#gpa-calculator-form-component").show();
        $("#course-title").text(course);
    } else {
        return showMessage("Please close current GPA calculator form!")
    }
}

function removeWarning(elem) {
    $(`#${elem}-error`).remove();
}
function checkInputValues(categories) {
    var isSuccessfull = true;

    if (categories.includes('final-exam') && $("#final-exam-percentage").val() == '') {
        var errorMes = `<span class="mg-l-10 error-message-container" id="final-exam-error">Required</span>`;
        appendToComponent("final-exam-row", errorMes);
        isSuccessfull = false;
        console.log("final-exam")
    }
    if (categories.includes('participation') && $("#participation-percentage").val() == '') {
        var errorMes = `<span class="mg-l-10 error-message-container" id="participation-error">Required</span>`;
        appendToComponent("participation-row .long-col", errorMes);
        isSuccessfull = false;
        console.log("participation")
    }

    if (categories.includes('mid-exam') && $("#mid-exam-number").val() == '') {
        var errorMes = `<span class="mg-l-10 error-message-container" id="mid-exam-error">Required</span>`;
        appendToComponent("mid-exam-row .long-col", errorMes);
        isSuccessfull = false;
        console.log("mid-exam")
    }

    if (categories.includes('quiz') && $("#quiz-number").val() == '') {
        var errorMes = `<span class="mg-l-10 error-message-container" id="quiz-error">Required</span>`;
        appendToComponent("quiz-row .long-col", errorMes);
        isSuccessfull = false;
        console.log("quiz")
    }

    if (categories.includes('assignment') && $("#assignment-number").val() == '') {
        var errorMes = `<span class="mg-l-10 error-message-container" id="assignment-error">Required</span>`;
        appendToComponent("assignment-row .long-col", errorMes);
        isSuccessfull = false;
        console.log("assignment")
    }

    if (categories.includes('lab') && $("#lab-number").val() == '') {
        var errorMes = `<span class="mg-l-10 error-message-container" id="lab-error">Required</span>`;
        appendToComponent("lab-row .long-col", errorMes);
        isSuccessfull = false;
        console.log("lab")
    }

    if (isSuccessfull) {
        return true;
    }

}

function calculateFinalExamPercentage() {
    var finalExamWeight = parseInt($("#final-exam-weight").val());
    var finalExamPercentageOfUser = parseInt($("#final-exam-percentage").val());
    var finalExamPercentage = (finalExamWeight * finalExamPercentageOfUser) / 100;
    return finalExamPercentage;
}
function calculateParticipationPercentage() {
    var participationWeight = parseInt($("#participation-weight").val());
    var participationPercentageOfUser = parseInt($("#participation-percentage").val());
    var participationPercentage = (participationWeight * participationPercentageOfUser) / 100;
    return participationPercentage;
}

function calculatePercentage(category) {
    var weight = parseInt($(`#${category}-weight`).val());
    var number = parseInt($(`#${category}-number`).val());
    var percentageOfUser = 0;
    var drop = 0;
    for (var i = 1; i <= number; i++) {
        if (category == 'quiz') {
            var score = $(`#quiz-score-${i}`).val();
            var maxScore = parseInt($(`#quiz-score-max-${i}`).val());
            if (score == '') {
                score = 0;
            }
            var percentage = (parseInt(score) / maxScore) * 100;
            if ($(`#quiz-drop-${i}`).is(":checked") == false) {
                percentageOfUser += percentage;
            }
            else {
                drop++;
            }
        } else {
            var value = $(`#${category}-${i}`).val();
            if (value == '') {
                value = 0;
                percentageOfUser += value;
            }
            else {
                if ($(`#${category}-drop-${i}`).is(":checked") == false) {
                    percentageOfUser += parseInt(value);
                }
                else {
                    drop++;
                }
            }
        }
    }
    var percentage = (weight * percentageOfUser) / (100 * (number - drop))
    return percentage;
}


function calculateGpa() {
    var categories = JSON.parse(localStorage.getItem("Categories"));
    if (checkInputValues(categories)) {
        var totalPercentage = 0;
        for (var i = 0; i < categories.length; i++) {
            if (categories[i] == 'final-exam') {
                totalPercentage += calculateFinalExamPercentage();
            }
            else if (categories[i] == 'participation') {
                totalPercentage += calculateParticipationPercentage();
            }
            else {
                totalPercentage += calculatePercentage(categories[i]);
            }
        }
        $.ajax({
            type: "POST",
            url: "/Home/CalculateGpa",
            data: { 'percentage': parseInt(totalPercentage) },
            cache: false,
            success: function (data) {
                console.log(parseInt(totalPercentage))
                $("#total-percentage-container").text(`${parseInt(totalPercentage)}%`);
                $("#grade-container").text(data[0]);
                $("#gpa-container").text(data[1]);
                $("#result-row").show();
            }
        })
    }

}