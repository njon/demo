document.addEventListener("DOMContentLoaded", function () {
    const editor = document.getElementById('tinymce-mytextarea');

    if (editor) {
        let options = {
            selector: '#tinymce-mytextarea',
            height: 300,
            menubar: false,
            statusbar: false,
            license_key: 'gpl',
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat',
            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; -webkit-font-smoothing: antialiased; }'
        }
        if (localStorage.getItem("tablerTheme") === 'dark') {
            options.skin = 'oxide-dark';
            options.content_css = 'dark';
        }
        tinyMCE.init(options);
    }
})


function getWorkingHoursJSON() {
    const workingHoursElements = document.querySelectorAll('.working-hours');
    const workingHours = {};

    workingHoursElements.forEach(element => {
        const text = element.textContent.trim();
        const day = text.split('working hours:')[0].trim().toLowerCase();
        const activeCheckbox = element.querySelector(`#active-day-${day}`);

        if (activeCheckbox && !activeCheckbox.checked) {
            workingHours[day] = { disabled: true };
        } else {
            const startHourElement = parseInt(element.querySelector(`.start-hour-${day.toLowerCase()}`).textContent);
            const startMinuteElement = parseInt(element.querySelector(`.start-minute-${day.toLowerCase()}`).textContent);
            const endHourElement = parseInt(element.querySelector(`.end-hour-${day.toLowerCase()}`).textContent);
            const endMinuteElement = parseInt(element.querySelector(`.end-minute-${day.toLowerCase()}`).textContent);
            const startMinutes = ((startHourElement * 60) + startMinuteElement);
            const endMinutes = (endHourElement * 60) + endMinuteElement;

            workingHours[day] = {
                start: startMinutes,
                end: endMinutes
            };
        }
    });

    return JSON.stringify(workingHours);
}

document.addEventListener("DOMContentLoaded", function () {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const workingHoursContainer = document.getElementById("working-hours");

    days.forEach(day => {
        const dayId = `range-connect-${day.toLowerCase()}`;

        // Create the HTML structure for each day
        workingHoursContainer.innerHTML += `
                    <div class="clear mb-5">
                    <div class="working-hours">
                    <input class="form-check-input day-checkbox" id="active-day-${day.toLowerCase()}" type="checkbox" checked>
                    <span class="time-text"> ${day} working hours:
                       <span class="start-hour-${day.toLowerCase()}">10</span>:<span class="start-minute-${day.toLowerCase()}">00</span>
                        - <span class="end-hour-${day.toLowerCase()}">22</span>:<span class="end-minute-${day.toLowerCase()}">00</span></span></div>
                    <div class="form-range mb-2 noUi-target noUi-ltr noUi-horizontal noUi-txt-dir-ltr" id="${dayId}"></div>
                       
                    </div>
                `;
    });

    days.forEach(day => {
        const dayName = day.toLowerCase();
        const dayId = `range-connect-${dayName.toLowerCase()}`;
        const startHourDisplay = document.querySelector(`.start-hour-${day.toLowerCase()}`);
        const startMinuteDisplay = document.querySelector(`.start-minute-${day.toLowerCase()}`);
        const endHourDisplay = document.querySelector(`.end-hour-${day.toLowerCase()}`);
        const endMinuteDisplay = document.querySelector(`.end-minute-${day.toLowerCase()}`);
        const activeCheckbox = document.getElementById(`active-day-${dayName}`);
        const dayContainer = activeCheckbox.closest('.clear'); //find the parent div

        const time = timeObject[dayName];
        let minutes;
        if(time && time.disabled){
            minutes = [10*60, 22*60];
            activeCheckbox.checked = false;
        }else if (time){
            minutes = [time.start, time.end];
        }else{
            minutes = [10*60, 22*60];
        }

        const sliderElement = document.createElement("div");
        sliderElement.id = dayId;
        document.getElementById(dayId).appendChild(sliderElement);

        const slider = window.noUiSlider && noUiSlider.create(sliderElement, {
            start: minutes, // Start in minutes
            connect: [false, true, false],
            step: 5, // Step in minutes
            range: {
                min: 0,
                max: 24 * 60 // Max in minutes
            }
        });

        slider.on('update', function (values, handle) {
            const startMinutes = parseInt(values[0]);
            const endMinutes = parseInt(values[1]);

            const startHour = Math.floor(startMinutes / 60);
            const startMinute = startMinutes % 60;
            const endHour = Math.floor(endMinutes / 60);
            const endMinute = endMinutes % 60;

            startHourDisplay.textContent = String(startHour).padStart(2, '0');
            startMinuteDisplay.textContent = String(startMinute).padStart(2, '0');
            endHourDisplay.textContent = String(endHour).padStart(2, '0');
            endMinuteDisplay.textContent = String(endMinute).padStart(2, '0');
            document.getElementById('working-hours-json').value = getWorkingHoursJSON();
        });

        // Add event listener to the checkbox
        activeCheckbox.addEventListener('change', function () {
            if (this.checked) {
                dayContainer.classList.remove('disabled-day');
                slider.enable();
            } else {
                dayContainer.classList.add('disabled-day');
                slider.disable();
            }
            document.getElementById('working-hours-json').value = getWorkingHoursJSON();
        });
        //Initial State
        if(!activeCheckbox.checked){
            dayContainer.classList.add('disabled-day');
            slider.disable();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const toTimeElement = document.getElementById('to-time');
    const transformToHourElement = document.querySelector('.transform-to-hour');

    if (toTimeElement && transformToHourElement) {
        toTimeElement.addEventListener('input', function() {
            const minutes = parseInt(this.value) || 0;
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            transformToHourElement.textContent =
                `${hours}h ${remainingMinutes}m`.replace('0h ', '').replace(' 0m', '');
        });
    }
});