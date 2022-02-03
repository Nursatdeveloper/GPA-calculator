function handlePageLoad(){

    $("#final-exam-percentage-alert").hide();
    $("#mid-exam-number-alert").hide();
    $("#quiz-number-alert").hide();
    $(".gpa-calculator-component").hide();

    var courseList = JSON.parse(localStorage.getItem("courseList"));
    for(var i = 1; i <= courseList.length; i++){
        addCourseToCourseListComponent(i, courseList[i-1])
    }
    var categories = JSON.parse(localStorage.getItem("categories"))
    if(categories != null){
        localStorage.removeItem("categories");
    }

}

function handleAddCourse(){
    var courseName = $("#course-name").val();
    var courses = JSON.parse(localStorage.getItem("courseList"));
    if(courses == null){
        var courseList = [];
        courseList[0] = courseName;
        localStorage.setItem("courseList", JSON.stringify(courseList));
        addCourseToCourseListComponent(0, courseName)
    }
    else{
        var courseList = JSON.parse(localStorage.getItem("courseList"));
        courseList[courseList.length] = courseName;
        localStorage.setItem("courseList", JSON.stringify(courseList));
        addCourseToCourseListComponent(courseList.length, courseName)
    }
    $("#course-name").val('');
}
function addCourseToCourseListComponent(number, courseName){
    $(".course-list-wrapper").append(`
    <div class="course-list-item">
        <div class="course-list-item-number">
            ${number})
        </div>
        <div class="course-list-item-name">
            ${courseName}
        </div>
        <div class="course-list-item-options">
            <button class="link" value="${courseName}" onclick="showGpaCalcForm(this)">Calculate GPA</button>
            <button class="remove-btn"' onclick="handleRemoveCourse(${number-1})">Remove </button>
        </div>
    </div>
    `)
}
function showGpaCalcForm(elem){
    $(".gpa-calculator-component").toggle();
    $("#gpa-calculator-course-title").text(elem.value);
}

function handleRemoveCourse(index){
    var courseList = JSON.parse(localStorage.getItem("courseList"));
    var newCourseList = courseList.filter(item => item != courseList[index]);
    localStorage.setItem("courseList", JSON.stringify(newCourseList));
    $(".course-list-wrapper").empty();
    handlePageLoad();
}

function handleAddNewCategory(name){
    var categories = JSON.parse(localStorage.getItem("categories"));  
    var index = 0;
    if(categories == null){
        index = 0;
        var category = [];
        category[0] = name;
        localStorage.setItem("categories",JSON.stringify(category));
    }
    else if(categories.length == 0){
        categories[0] = name;
        localStorage.setItem("categories",JSON.stringify(categories));
    }
    else{
        index = categories.length;
        categories[index] = name;
        localStorage.setItem("categories",JSON.stringify(categories));
    } 
    $(".additional-categories").append(`
        <div id="category-${index}" class="gpa-calculator-section">
            <label class="bold">${name}:</label>
            <input onchange="handlePercentageChange(this)" type="text" id="${name}"/>
            <span>
                <svg onclick="handleRemoveCategory(${index})" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </span>
        </div>
    `);
    if(name == 'Labs'){
        addLabCategoryComponent(index)
    }else if(name == 'Assignments'){
        addAssignmentCategoryComponent(index);
    }else if(name == 'Participation'){
        addParticipationCategoryComponent(index);
    }
}
function addParticipationCategoryComponent(index){
    $(".category-items").append(`
    <div id="category-item-${index}" class="labs-calculator margin-t-20">
        <div>
            <span class="bold">Participation</span>
        </div>
        <div class="margin-b-5">
            <span>Enter your total participation percentage</span>
            <input id="participation-percentage" type="text" class="short-input"/><br/>
        </div>
    </div>
`)
}
function addLabCategoryComponent(index){
    $(".category-items").append(`
        <div id="category-item-${index}" class="labs-calculator margin-t-20">
            <div>
                <span class="bold">Labs</span>
            </div>
            <div class="margin-b-5">
                <span>Total number of Labs</span>
                <input onchange="handleLabNumberChange(this)" type="text" class="short-input"/><br/>
            </div>
            <div class="labs-container">

            </div>
        </div>
    `)
}
function addAssignmentCategoryComponent(index){
    $(".category-items").append(`
    <div id="category-item-${index}" class="assignment-calculator margin-t-20">
        <div>
            <span class="bold">Assignments</span>
        </div>
        <div class="margin-b-5">
            <span>Total number of Assignments</span>
            <input onchange="handleAssignmentNumberChange(this)" type="text" class="short-input"/><br/>
        </div>
        <div class="assignment-container">

        </div>
    </div>
`)
}

function handleRemoveCategory(index){
    var categories = JSON.parse(localStorage.getItem("categories"));
    if(categories.length == 1){
        var newArray = [];
        localStorage.setItem("categories", JSON.stringify(newArray));
    }
    else{
        var newCategories = categories.filter(elem => elem != categories[index])
        localStorage.setItem("categories", JSON.stringify(newCategories));
    }
    $(`#category-item-${index}`).remove();
    $(`#category-${index}`).remove();
}

function handlePercentageChange(elem){
    var finalExamWeight = $("#final-exam-weight").val()
    if(finalExamWeight == ''){
        finalExamWeight = 0;
    }
    var midExamWeight = $("#mid-exam-weight").val()
    if(midExamWeight == ''){
        midExamWeight = 0;
    }
    var quizWeight = $("#quiz-weight").val()
    if(quizWeight == ''){
        quizWeight = 0;
    }

    var totalExamWeight = parseInt(finalExamWeight) + parseInt(midExamWeight) + parseInt(quizWeight);
    var categories = JSON.parse(localStorage.getItem("categories"));
    if(categories != null && categories.length != 0){
        for(var i = 0; i < categories.length; i++){
            var addedCategoryWeight =$(`#${categories[i]}`).val();
            if(addedCategoryWeight != ''){
                
                totalExamWeight += parseInt(addedCategoryWeight);
            }
        }
    }
    $("#total-percent").val(totalExamWeight);
    if(totalExamWeight > 100){
        alert("Total percentage cannot be more than 100%, idiot!");
    }
    
}
function handleAssignmentNumberChange(elem){
    var number = elem.value;
    $(".assignment-container").empty();
    $(".assignment-container").append(`
        <div class="alert-message-assignment alert-message">
            <span>Enter the percentage for each assignment</span>
            <svg onclick="hideAlertMessageAssignment()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
            </svg>
        </div>
        <div class="mid-exam-header">
            <div class="row">
                <div class="col-long bold">
                    <span>Assignments</span>
                </div>
                <div class="assignment-checkbox-header bold">
                    <span>Drop</span>
                </div>
            </div>
        </div>
        <div class="mid-exam-wrapper">
            <div class="assignment-list">

            </div>
            <div class="assignment-droppable">

            </div>
        </div>
    `)
    for(var i = 0; i < number; i++){
        $(".assignment-list").append(`
            <div  class="mid-exam-item">
                <span>Assignment ${i+1}</span>
                <input class="short-input" id="assignment-${i+1}" type="text"/>
            </div>
        `);
        $(".assignment-droppable").append(`
            <div class="lab-checkbox-container">
                <input id="assignment-drop-${i+1}" value="${i+1}" class="form-checkbox" type="checkbox"/>
            </div>
        `)
    }
    localStorage.setItem("assignments", number);
}
function handleLabNumberChange(elem){
    var labNumber = elem.value;
    $(".labs-container").empty();
    $(".labs-container").append(`
        <div class="alert-message-lab alert-message">
            <span>Enter the percentage for each lab</span>
            <svg onclick="hideAlertMessageLab()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
            </svg>
        </div>
        <div class="mid-exam-header">
            <div class="row">
                <div class="col-long bold">
                    <span>Labs</span>
                </div>
                <div class="lab-checkbox-header bold">
                    <span>Drop</span>
                </div>
            </div>
        </div>
        <div class="mid-exam-wrapper">
            <div class="lab-list">

            </div>
            <div class="lab-droppable">

            </div>
        </div>
    `);
    for(var i = 0; i < labNumber; i++){
        $(".lab-list").append(`
            <div  class="mid-exam-item">
                <span>Lab ${i+1}</span>
                <input class="short-input" id="lab-${i+1}" type="text"/>
            </div>
        `);
        $(".lab-droppable").append(`
            <div class="lab-checkbox-container">
                <input id="lab-drop-${i+1}" value="${i+1}" class="form-checkbox" type="checkbox"/>
            </div>
        `)
    }
    localStorage.setItem("labs", labNumber);
}
function handleMidExamNumberChange(elem){
    var number = parseInt(elem.value);
    $(".mid-exams-container").empty();
    $(".mid-exams-container").append(`
        <div class="alert-message-mid-exam alert-message">
            <span>Enter the percentage of correct answers</span>
            <svg onclick="hideAlertMessageMidExam()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
            </svg>
        </div>
        <div class="mid-exam-header">
            <div class="row">
                <div class="col-long bold">
                    <span>Mid-exams</span>
                </div>
                <div class="col-short bold">
                    <span>Drop</span>
                </div>
            </div>
        </div>
        <div class="mid-exam-wrapper">
            <div class="mid-exam-list">

            </div>
            <div class="mid-exam-droppable">

            </div>
        </div>
    `)
    for(var i = 0; i < number; i++){
        $(".mid-exam-list").append(`
            <div class="mid-exam-item">
                <span>Mid-term exam ${i+1}</span>
                <input class="short-input" type="text" id="mid-exam-${i+1}"/>
            </div>
        `);
        $(".mid-exam-droppable").append(`
            <div class="mid-exam-checkbox-container">
                <input value="${i+1}" id="mid-drop-${i+1}" class="form-checkbox" type="checkbox"/>
            </div>
        `)
    }
    localStorage.setItem("midExams", number);
}
function handleWeeklyQuizNumberChange(elem){
    var number = parseInt(elem.value);
    $(".weekly-quizzes-container").empty();
    $(".weekly-quizzes-container").append(`
        <div class="alert-message-quiz alert-message">
            <span>Enter the number of correct answers</span>
            <svg onclick="hideAlertMessageQuiz()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
            </svg>
        </div>
        <div class="mid-exam-header">
            <div class="row">
                <div class="col-long bold">
                    <span>Quizzes</span>
                </div>
                <div class="bold">
                    <span>Drop</span>
                </div>
            </div>
        </div>
        <div class="mid-exam-wrapper">
            <div class="quiz-list">

            </div>
            <div class="quiz-drop">

            </div>
        </div>
    `)
    for(var i = 0; i < number; i++){
        $(".quiz-list").append(`
            <div id="quiz-${i+1}" class="mid-exam-item">
                <span>Quiz ${i+1}</span>
                <input id="score-${i+1}" type="text" class="input-tiny"/>
                <span>/</span>
                <input id="max-${i+1}" type="text" class="input-tiny"/>
            </div>
        `);
        $(".quiz-drop").append(`
            <div class="mid-exam-checkbox-container">
                <input id="quiz-drop-${i+1}" value="${i+1}" class="form-checkbox" type="checkbox"/>
            </div>
        `)
    }
    localStorage.setItem("quiz", number);
}
function handleCategoryItemNumberChange(elem){
    var number = parseInt(elem.value);
}
function hideAlertMessage(){
    $(".alert-message").hide();
}
function hideAlertMessageAssignment(){
    $(".alert-message-assignment").hide();
}
function hideAlertMessageLab(){
    $(".alert-message-lab").hide();
}
function hideAlertMessageMidExam(){
    $(".alert-message-mid-exam").hide();
}
function hideAlertMessageQuiz(){
    $(".alert-message-quiz").hide();
}

function calculateGpa(){
    var examWeights = []

    var finalExamWeight = $("#final-exam-weight").val();
    var finalExamArr = ["Final", finalExamWeight];
    examWeights.push(finalExamArr);

    var midExamWeight = $("#mid-exam-weight").val();
    var MidExamArr = ["Mid", midExamWeight];
    examWeights.push(MidExamArr);

    var quizWeight = $("#quiz-weight").val();
    var quizArr = ["Quiz", quizWeight];
    examWeights.push(quizArr)

    var totalPercentage = finalExamWeight + midExamWeight + quizWeight;
    var addedCategories = JSON.parse(localStorage.getItem("categories"));
    if(addedCategories == null || addedCategories.length == 0){
        
        if(totalPercentage != 100){
            return alert("The sum of all exams must be 100%!");
        }
    }else{
        for(var i = 0; i < addedCategories.length; i++){
            var value = $(`#${addedCategories[i]}`).val();
            var array = [addedCategories[i], value]
            examWeights.push(array)
            if(addedCategories[i] == 'Labs'){
                examWeights[i+3][2] = calculateLabs(value);
            }else if(addedCategories[i] == 'Assignments'){
                examWeights[i+3][2] = calculateAssignments(value);
            }else{
                var participation = $("#participation-percentage").val();
                examWeights[i+3][2] = (participation * value)/100
            }
        }
    }


    //FINAL EXAM
    var finalExamPercentage = $("#final-exam-percentage").val();
    if(finalExamPercentage == ''){
        $("#final-exam-percentage-alert").show();   
        setTimeout(function(){
            $("#final-exam-percentage-alert").hide()
        }, 3000);
    }else{
        var final = (finalExamPercentage*finalExamWeight)/100;
        examWeights[0][2] = final;
    }

    //MID-TERM EXAM
    var midExamNumber = $("#mid-exam-number").val();
    if(midExamNumber == ''){
        $("#mid-exam-number-alert").show();   
        setTimeout(function(){
            $("#mid-exam-number-alert").hide();
        }, 3000);
    }else{
        examWeights[1][2] = calculateMidTerm(midExamWeight);
    }

    //WEEKLY QUIZZES
    var quizNumber = $("#weekly-quiz-number").val();
    if(quizNumber == ''){
        $("#quiz-number-alert").show();   
        setTimeout(function(){
            $("#quiz-number-alert").hide();
        }, 3000);
    }else{
        examWeights[2][2] = calculateQuiz(quizWeight);
    }


    $(".gpa-calculator-component").append(`
        <div class="total-information">
            <hr/>
            <span class="bold">Result</span><br/>
            <span class="font-s-14">Final exam:</span><span class="font-s-14" id="final-exam-result">${round(examWeights[0][2], 2)}/${examWeights[0][1]}</span><br/>
            <span class="font-s-14">Mid-term exam:</span><span class="font-s-14" id="mid-exam-result">${round(examWeights[1][2],2)}/${examWeights[1][1]}</span><br/>
            <span class="font-s-14">Weekly quizzes:</span><span class="font-s-14" id="quiz-result">${round(examWeights[2][2],2)}/${examWeights[2][1]}</span><br/>
        </div>
    `)
    var result = 0
    for(var i = 0; i < examWeights.length; i++){
        result += examWeights[i][2];
        if(i > 2){
                $(".total-information").append(`
                <span class="font-s-14">${examWeights[i][0]}</span><span class="font-s-14" >${round(examWeights[i][2],2)}/${examWeights[i][1]}</span><br/>
            `)
        }
    }
    $.ajax({
        url:"/Home/CalculateGpa",
        type:"POST",
        data:{'percentage': round(result, 0)},
        cache:false,
        success: function(data){
            $(".total-information").append(`
            <span class="font-s-14 bold">Percentage: </span><span class="font-s-14" >${round(result, 2)}</span><br/>
            <span class="font-s-14 bold">GPA: </span><span class="font-s-14" >${data[1]}</span><br/>
            <span class="font-s-14 bold">Grade: </span><span class="font-s-14" >${data[0]}</span><br/>
            <button id="reset-btn" onclick="resetFields()">Reset</button>
        `)
        }
    })


}
function resetFields(){
    $("input").val('');
    $(".total-information").hide();
}
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function calculateAssignments(assignmentWeight){
    var assignmentNumber = JSON.parse(localStorage.getItem("assignments"));
    var percentages = 0;
    var drop = 0;
    var dropNum = 0
    for(var i = 1; i <= assignmentNumber; i++){
        if($(`#assignment-drop-${i}`).is(":checked")){
            drop = $(`#assignment-drop-${i}`).val();
            dropNum++;
            continue;
        }
        var percentage = parseInt($(`#assignment-${i}`).val());
        percentages += percentage;
    }
    var assignments = (percentages*assignmentWeight)/((assignmentNumber-dropNum)*100);
    localStorage.removeItem("assignments");
    return assignments;
}
function calculateLabs(labWeight){
    var labNumber = JSON.parse(localStorage.getItem("labs"));
    var percentages = 0;
    var drop = 0;
    var dropNum = 0
    for(var i = 1; i <= labNumber; i++){
        if($(`#lab-drop-${i}`).is(":checked")){
            drop = $(`#lab-drop-${i}`).val();
            dropNum++;
            continue;
        }
        var percentage = parseInt($(`#lab-${i}`).val());
        percentages += percentage;
    }
    var labs = (percentages*labWeight)/((labNumber-dropNum)*100);
    localStorage.removeItem("labs");
    return labs;
}
function calculateQuiz(quizWeight){
    var quizNumber = JSON.parse(localStorage.getItem("quiz"));
    var percentages = 0;
    var drop = 0;
    var dropNum = 0
    for(var i = 1; i <= quizNumber; i++){
        if($(`#quiz-drop-${i}`).is(":checked")){
            drop = $(`#quiz-drop-${i}`).val();
            dropNum++;
            continue;
        }
        var score = parseInt($(`#score-${i}`).val());
        var maxScore = parseInt($(`#max-${i}`).val());
        
        var percentage = (score/maxScore)*100;
        percentages += percentage
    }
    var quiz = (percentages * quizWeight)/((quizNumber-dropNum)*100);
    localStorage.removeItem("quiz");
    return quiz;
}
function calculateMidTerm(midExamWeight){
    var midExams = JSON.parse(localStorage.getItem("midExams"));
    var midExamPercentages = [];
    var percentages = 0;
    var drop = 0;
    var dropNum = 0
    for(var i = 1; i <= midExams; i++){
        if($(`#mid-drop-${i}`).is(':checked')){
            drop = $(`#mid-drop-${i}`).val();
            dropNum++;
            continue;
        }
        var percentage = $(`#mid-exam-${i}`).val();

        if(percentage == ''){
        }else{
            percentages += parseInt(percentage);
            midExamPercentages.push(percentage);
        }
    }
    var mid = (percentages*midExamWeight)/((midExams-dropNum)*100);
    localStorage.removeItem("midExams");
    return mid;

}