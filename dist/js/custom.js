function getWorkingHoursJSON() {
    const workingHoursElements = document.querySelectorAll('.working-hours');
    const workingHours = {};

    workingHoursElements.forEach(element => {
        const text = element.textContent.trim();
        const day = text.split('working hours:')[0].trim().toLowerCase();


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
                    <div class="clear">
                    
                    <div class="working-hours"><input class="form-check-input" type="checkbox" checked> ${day} working hours:
                       <span class="start-hour-${day.toLowerCase()}">10</span>:<span class="start-minute-${day.toLowerCase()}"></span>
                        - <span class="end-hour-${day.toLowerCase()}">22</span>:<span class="end-minute-${day.toLowerCase()}"></span></div>
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

        const timeObject = {
            "monday": {"start": 600, "end": 1030},
            "tuesday": {"start": 600, "end": 1030},
            "wednesday": {"start": 815, "end": 1030},
            "thursday": {"start": 815, "end": 1030},
            "friday": {"start": 815, "end": 1030},
            "saturday": {"start": 815, "end": 1030},
            "sunday": {"start": 815, "end": 1030}
        };

        const time = timeObject[dayName];
        const minutes = time ? [time.start, time.end] : [10 * 60, 22 * 60];

        const sliderElement = document.createElement("div");
        sliderElement.id = dayId;
        document.getElementById(dayId).appendChild(sliderElement);

        window.noUiSlider && (noUiSlider.create(sliderElement, {
            start: minutes, // Start in minutes
            connect: [false, true, false],
            step: 5, // Step in minutes
            range: {
                min: 0,
                max: 24 * 60 // Max in minutes
            }
        })).on('update', function (values, handle) {
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
    });
});