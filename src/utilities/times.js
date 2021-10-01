// define the courseConflict function
const terms = { F: 'Fall', W: 'Winter', S: 'Spring'}; 

const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);

const days = ['M', 'Tu', 'W', 'Th', 'F'];

const daysOverlap = (days1, days2) => ( 
  days.some(day => days1.includes(day) && days2.includes(day))
);

const hoursOverlap = (hours1, hours2) => (
  Math.max(hours1.start, hours2.start) < Math.min(hours1.end, hours2.end)
);

const timeConflict = (course1, course2) => (
  daysOverlap(course1.days, course2.days) && hoursOverlap(course1.hours, course2.hours)
);

const courseConflict = (course1, course2) => (
  getCourseTerm(course1) === getCourseTerm(course2)
  && timeConflict(course1, course2)
);

export const hasConflict = (course, selected) => (
  selected.some(selection => courseConflict(course, selection)) // courseConflict return boolean
)

// convert the time of class into minutes from midnight
const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

// To avoid constantly re-parsing the meeting strings,
// add the new fields to each course when the courses are first fetched
const mapValues = (fn, obj) => (
  // Object.fromEntries : create a new object from an old one
  // Object.entries : return the attributes of each key-value
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)]))
);

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

export const addScheduleTimes = schedule => ({
  // there are two attributes of json : 1.title 2.courses(2.1 id, 2.2 title, 2.3 meets)
  title: schedule.title,
  courses: mapValues(addCourseTimes, schedule.courses)
});
