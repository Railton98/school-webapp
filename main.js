var baseUrl = 'http://localhost:8080/api';

$(document).ready(function() {
    listStudents();

    $('#list-body').on('click', '.delete-btn', function() {
        let id = $(this).attr('data-id');

        deleteStudents(id);
    });

    $('#list-body').on('click', '.update-btn', function() {
        let id = $(this).attr('data-id');

        mountFormForUpdate(id);
    });

    $('#create-btn').click( () => {
        showForm();
    });

    $('#form-register').submit( (e) => {
        e.preventDefault();

        let id = $('#id').val();
        if (id == "") {
            createStudent();
        } else {
            updateStudents(id);
        }
    });
});

function clearHideForm() {
    $('#id').val('');
    $('#name').val('');
    $('#birth').val('');
    $('#gender').val( $('#gender option:first').val() );
    $('#classroom').val('');
    $('#register').css('display', 'none');
}

function showForm() {
    $('#register').css('display', 'block');
}

function showValidationErrors(error) {
    if (error.status === 422) {
        let errors = error.responseJSON;
        for (const key in errors) {
            alert(`${key}: ${errors[key]}`);
        }
    } else {
        alert(error.responseText);
    }
}

function createStudent() {
    $.ajax({
        type: 'POST',
        url: `${baseUrl}/students`,
        contentType: 'application/json',
        dataType: 'json',
        data: getStudentJsonFromForm(),
        success: (student) => {
            alert(`Aluno(a) ${student.name} Cadastrado com Sucesso!`);

            clearHideForm();

            listStudents();
        },
        error: (error) => {
            showValidationErrors(error);
        }
    });
}

function getStudentJsonFromForm() {
    return JSON.stringify({
        'name': $('#name').val(),
        'birth': $('#birth').val(),
        'classroom_id': $('#classroom').val(),
        'gender': $('#gender').find('option:selected').val(),
    });
}

function listStudents() {
    $.ajax({
        type: 'GET',
        url: `${baseUrl}/students`,
        contentType: 'application/json',
        success: (students) => {
            let content;
            for (const student of students.data) {
                content += `
                <tr>
                <td scope="row">${student.id}</td>
                <td scope="row">${student.name}</td>
                <td scope="row">${student.birth}</td>
                <td scope="row">${student.gender}</td>
                <td scope="row">
                    <button class="btn btn-danger delete-btn" data-id="${student.id}">
                        <i class="far fa-trash-alt"></i>
                    </button>
                    <button class="btn btn-info update-btn" data-id="${student.id}">
                        <i class="fas fa-pen-alt"></i>
                    </button>
                </td>
                </tr>
                `;
            }
            $('#list-body').html(content);
        },
    });
}

function mountFormForUpdate(id) {
    $.ajax({
        type: 'GET',
        url: `${baseUrl}/students/${id}`,
        contentType: 'application/json',
        success: (student) => {
            $('#id').val(student.data.id);
            $('#name').val(student.data.name);
            $('#birth').val(student.data.birth);
            $('#classroom').val(student.data.classroom.id);
            $('#gender').val(student.data.gender);
        }
    });

    showForm();
}

function updateStudents(id) {
    $.ajax({
        type: 'PUT',
        url: `${baseUrl}/students/${id}`,
        contentType: 'application/json',
        dataType: 'json',
        data: getStudentJsonFromForm(),
        success: () => {
            alert(`Aluno(a) Atualizado com Sucesso!`);

            clearHideForm();

            listStudents();
        },
        error: (error) => {
            showValidationErrors(error);
        }
    });
}

function deleteStudents(id) {
    $.ajax({
        type: 'DELETE',
        url: `${baseUrl}/students/${id}`,
        contentType: 'application/json',
        success: () => {
            listStudents();

            alert('Aluno(a) Escluído com Sucesso!');
        }
    });
}
