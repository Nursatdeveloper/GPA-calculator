function renderCourseList() {
    var coursesArray = JSON.parse(localStorage.getItem("Courses"));
    if (coursesArray == null) {

    } else if (coursesArray.length == 0) {

    } else {

        $("#course-list-component").empty();
        for (var i = 0; i < coursesArray.length; i++) {
            $("#course-list-component").append(`
                <div class="course-list-item">
                    <div class="course-list-item-left fw-600 fs-18"><span>${i + 1}) </span><span> ${coursesArray[i]}</span></div>
                    <div class="course-list-item-right">
                        <button class="btn-main fs-14" onclick="showGpaCalculator('${coursesArray[i]}')">Calculate GPA</button>
                        <button class="btn-delete fs-14" onclick="deleteCourse('${i}')">Delete</button>
                    </div>
                </div>
            `)
        }

    }
}

function renderOptionsToSelectTag(tagId, optionNumber) {
    for (var i = optionNumber; i > 0; i--) {
        $(`#${tagId}`).append(`
            <option value="${i}">${i}</option>
        `);
    }
}


function renderCategory(elemId, selectOptionId, optionNumber) {
    var categories = JSON.parse(localStorage.getItem("Categories"));
    if (categories == null) {
        categories = [elemId];
    } else if (categories.length == 0) {
        categories[0] = elemId;
    } else {
        if (!categories.includes(elemId)) {
            categories[categories.length] = elemId;
        }
    }
    localStorage.setItem("Categories", JSON.stringify(categories));

    $(`#${elemId}`).show();
    renderOptionsToSelectTag(selectOptionId, optionNumber);
}

function renderMidExamInputs() {
    removeWarning('mid-exam')
    var midExamNumber = parseInt($("#mid-exam-number").val());

    if (midExamNumber > 4) {
        return showMessage("Mid-term exam number cannot be more than 5!");
    }
    else {
        $(".mid-term-col").remove();
        for (var i = 1; i <= midExamNumber; i++) {

            $("#mid-term-col-container").append(`
            <div class="short-col mid-term-col">
                <div><span class="fw-600 fs-14">Mid-exam ${i}</span></div>
                <div>
                    <input type="text" class="input-short" id="mid-exam-${i}"/>
                    <span>/100%</span>
                </div>
                <div>
                    <span>Drop:</span>
                    <input type="checkbox" id="mid-exam-drop-${i}"/>
                </div>

            </div>
            `)
        }

    }
}

function renderQuizInputs() {
    removeWarning('quiz');
    var quizNumber = $("#quiz-number").val();
    var rowsInCol1 = 0;
    var rowsInCol2 = 0;
    if (quizNumber % 2 == 0) {
        rowsInCol1 = quizNumber / 2;
        rowsInCol2 = quizNumber / 2;
    } else {
        rowsInCol2 = parseInt(quizNumber / 2);
        rowsInCol1 = quizNumber - rowsInCol2;
    }
    $("#quiz-col-1").empty();
    $("#quiz-col-2").empty();
    for (var i = 1; i <= rowsInCol1; i++) {
        $("#quiz-col-1").append(`
            <div class=" pos-rel pd-5">
                <span>Quiz ${i}</span>
                <input type="text" class="input-small" id="quiz-score-${i}">/
                <input type="text" class="input-small" id="quiz-score-max-${i}">
                <span class="mg-l-15">Drop:</span>
                <input type="checkbox" id="quiz-drop-${i}" class="category-checkbox"/>
            </div>
        `)
    }
    for (var i = rowsInCol1 + 1; i <= quizNumber; i++) {
        $("#quiz-col-2").append(`
            <div class="pos-rel pd-5">
                <span>Quiz ${i}</span>
                <input type="text" class="input-small" id="quiz-score-${i}">/
                <input type="text" class="input-small" id="quiz-score-max-${i}">
                <span class="mg-l-15">Drop:</span>
                <input type="checkbox" id="quiz-drop-${i}" class="category-checkbox"/>
            </div>
        `)
    }
}

function renderAssignmentInputs() {
    removeWarning('assignment');
    var assignmentNumber = $("#assignment-number").val();
    $("#assignment-col-container").empty();
    for (var i = 1; i <= assignmentNumber; i++) {
        $("#assignment-col-container").append(`
            <div class="pos-rel pd-5">
                <span>Assignment ${i}</span>
                <input type="text" class="input-short" id="assignment-${i}"/>
                <span>/100%</span>
                <span class="mg-l-20">Drop:</span>
                <input type="checkbox" id="assignment-drop-${i}" class="category-checkbox" />
            </div>
        `)
    }
}
function renderLabInputs() {
    removeWarning('lab')
    var labNumber = parseInt($("#lab-number").val());
    var rowsInCol1 = 0;
    var rowsInCol2 = 0;
    if (labNumber % 2 == 0) {
        rowsInCol1 = labNumber / 2;
        rowsInCol2 = rowsInCol1;
    } else {
        rowsInCol2 = parseInt(labNumber / 2);
        rowsInCol1 = labNumber - rowsInCol2;
    }
    $("#lab-col-1").empty();
    $("#lab-col-2").empty();
    for (var i = 1; i <= rowsInCol1; i++) {
        $("#lab-col-1").append(`
            <div class=" pos-rel pd-5">
                <span>Lab ${i}</span>
                <input type="text" class="input-small" id="lab-${i}">
                <span>/100%</span>
                <span class="mg-l-10">Drop:</span>
                <input type="checkbox" id="lab-drop-${i}" class="category-checkbox"/>
            </div>
        `)
    }
    for (var i = rowsInCol1 + 1; i <= labNumber; i++) {
        $("#lab-col-2").append(`
            <div class=" pos-rel pd-5">
                <span>Lab ${i}</span>
                <input type="text" class="input-small" id="lab-${i}">
                <span>/100%</span>
                <span class="mg-l-10">Drop:</span>
                <input type="checkbox" id="lab-drop-${i}" class="category-checkbox"/>
            </div>
        `)
    }
}

function renderCategoryPercentageInputs() {
    var categories = JSON.parse(localStorage.getItem("Categories"));
    if (categories == null || categories.length == 0) {
        return 0;
    } else {
        var totalPercentage = 0;
        for (var i = 0; i < categories.length; i++) {
            var categoryWeight = parseInt($(`#${categories[i]}-weight`).val());
            totalPercentage += categoryWeight;
        }
        if (totalPercentage == 100) {
            var rows = ['final-exam', 'mid-exam', 'quiz', 'assignment', 'lab', 'participation'];
            for (var i = 0; i < rows.length; i++) {
                if (categories.includes(rows[i])) {
                    $(`#${rows[i]}-row`).show();
                } else {
                    $(`#${rows[i]}-row`).hide();
                }
            }
            $("#grading-categories-percentages").show();
        } else {
            return showMessage("The sum of all exam weights must be 100%");
        }
    }


}

function appendToComponent(elemId, newElement) {
    $(`#${elemId}`).append(`${newElement}`);
}