var page
var data = []
var dataPerson
var dataPage 

$(document).ready(function () {
    $(".loader").show()

    dataPerson = JSON.parse(localStorage.getItem('dataPerson'))
    data = dataPerson ? dataPerson : data
    dataPage = localStorage.getItem('dataPage')

    loadPerson();
})

function Myscroll() {
    if ($(window).width() < 576) {
        $(".content").on("scroll", function () {

            if (page <= 9) {
                var per = 100 * $(".content").scrollTop() / (document.getElementById('content').scrollHeight - document.getElementById('list-person').clientHeight);
                if (per == 100) {
                    $(".loader").show()
                    loadPerson()
                }
            } else {
                $(".content").off("scroll")
            }
        })
    } else {
        $(".content").on("scroll", function () {
            if (page <= 9) {
                var per = 100 * $(".content").scrollLeft() / (document.getElementById('content').scrollWidth - document.getElementById('list-person').clientWidth);
                if (per == 100) {
                    $(".loader").show()
                    loadPerson()
                }
            } else {
                $(".content").off("scroll")
            }
        })
    }

}

$(window).resize(function () {
    Myscroll()
});

function loadPerson() {

    $("#button-menu-color").prop('disabled', true);
    $("#button-menu-cities").prop('disabled', true);

    var cur_page = $("#current-page").val();
    page = dataPage ? eval(cur_page) + 1 : eval(cur_page) + 1;
    var url = "https://randomuser.me/api/?page=" + page + "&seed=e993a3f20ca1505c&results=10";

    if (page <= parseInt(dataPage)) {
        if (page == 1) {
            Myscroll()
        }
        cur_page = $("#current-page").val(parseInt(dataPage));
        $('#list-person').append(show_data(dataPerson))
        $(".loader").hide()

        $("#button-menu-color").prop('disabled', false);
        $("#button-menu-cities").prop('disabled', false);

        $("#button-menu-color").on("click", function () {

            var arr_sort = dataPerson.sort(function (a, b) {
                return a.bgcolor - b.bgcolor;
            })

            setTimeout(function () {
                $('#list-person').empty()
                $('#list-person').append(show_data(dataPerson))
            })
        })

        $("#button-menu-cities").on("click", function () {

            var arr_sort = dataPerson.sort(function (a, b) {
                var cityA = a.location.city.toUpperCase();
                var cityB = b.location.city.toUpperCase();
                if (cityA < cityB) {
                    return -1;
                }
                if (cityA > cityB) {
                    return 1;
                }

                // names must be equal
                return 0;
            })

            setTimeout(function () {
                $('#list-person').empty()
                $('#list-person').append(show_data(dataPerson))
            })
        })

    } else {
        $.ajax({ type: 'GET', url: url })
            .done(function (res) {
                $("#button-menu-color").prop('disabled', false);
                $("#button-menu-cities").prop('disabled', false);

                if (res.results.length > 0) {
                    $(".loader").hide()
                    cur_page = $("#current-page").val(page);

                    if (page == 1) {
                        Myscroll()
                    }

                    for (let i = 0; i < res.results.length; i++) {
                        if (res.results[i].dob.age < 21) {
                            Object.assign(res.results[i], { bgcolor: 3 });
                        } else if (res.results[i].dob.age > 21 && res.results[i].dob.age < 56) {
                            Object.assign(res.results[i], { bgcolor: 1 });
                        } else if (res.results[i].dob.age > 56) {
                            Object.assign(res.results[i], { bgcolor: 2 });
                        }
                        data.push(res.results[i])

                        // set the item in localStorage
                        localStorage.setItem('dataPerson', JSON.stringify(data));
                        localStorage.setItem('dataPage', page);
                    }

                    return data
                }
            })
            .done(function (result) {

                $('#list-person').append(show_data(result.results));

                $("#button-menu-color").on("click", function () {

                    var arr_sort = data.sort(function (a, b) {
                        return a.bgcolor - b.bgcolor;
                    })

                    setTimeout(function () {
                        localStorage.setItem('dataPerson', JSON.stringify(arr_sort))
                        $('#list-person').empty()
                        $('#list-person').append(show_data(data))
                    })
                })

                $("#button-menu-cities").on("click", function () {

                    var arr_sort = data.sort(function (a, b) {
                        var cityA = a.location.city.toUpperCase();
                        var cityB = b.location.city.toUpperCase();
                        if (cityA < cityB) {
                            return -1;
                        }
                        if (cityA > cityB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    })

                    setTimeout(function () {
                        localStorage.setItem('dataPerson', JSON.stringify(arr_sort))
                        $('#list-person').empty()
                        $('#list-person').append(show_data(data))
                    })
                })

            })
            .fail(function (error) {
                console.log("ERROR", error)
            })
    }
};

//show_data function for display
function show_data(datas) {
    var resultHTML = '';
    if (datas != null) {
        var obj = datas;
        for (var i = 0; i < obj.length; i++) {

            if (obj[i].dob.age < 21) {
                resultHTML += "<div class='fill-card bg-red'>";
            } else if (obj[i].dob.age > 21 && obj[i].dob.age < 56) {
                resultHTML += "<div class='fill-card bg-green'>";
            } else if (obj[i].dob.age > 56) {
                resultHTML += "<div class='fill-card bg-blue'>";
            }
            resultHTML += "<div class='section-fill-card'>";
            resultHTML += "<img class='card-photo' src='" + obj[i].picture.medium + "' alt=''>";

            resultHTML += "<div class='section-card-text'>";

            resultHTML += "<div class='card-text-small'>" + obj[i].name.title + " " + obj[i].name.first + " " + obj[i].name.last + "</div>";
            resultHTML += "<div class='card-text-small'>" + obj[i].dob.age + "</div>";
            resultHTML += "<div class='card-text-medium dnone'>" + obj[i].email + "</div>";

            resultHTML += "</div>";
            resultHTML += "</div>";

            resultHTML += "<div class='section-fill-card'>";
            resultHTML += "<div class='card-text-medium'>" + obj[i].location.city + ", " + obj[i].location.state + ", " + obj[i].location.postcode + "</div>";
            resultHTML += "</div>";
            resultHTML += "<div class='section-fill-card'>";
            resultHTML += "<div class='card-text-medium'>" + obj[i].email + "</div>";
            resultHTML += "</div>";
            resultHTML += "</div>";
            resultHTML += "</div>";
        }
    }
    return resultHTML;
}