class DateFormater {
    static formatFrenchDate(inputDate: string | undefined): string | undefined {
        if(inputDate){
            const dateObject = new Date(inputDate);

            const options: Intl.DateTimeFormatOptions = {
                day: "numeric",
                month: "long",
                year: "numeric",
            };
            const formattedDate = new Intl.DateTimeFormat(
                "fr-FR",
                options
            ).format(dateObject);

            return formattedDate;
        } else {
            return undefined
        }
    }
}

export default DateFormater;
