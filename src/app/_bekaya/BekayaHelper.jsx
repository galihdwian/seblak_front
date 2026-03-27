import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration)

const secretKey = "A9EE8B713E6F6F7F7BB54A9BF4DF4";

export const OpenSwal = (config) => {

  let cfg = {
    title: config.title,
    html: config.html,
    icon: config.icon ? config.icon : 'info',
    showConfirmButton: config.showConfirmButton,
    showCancelButton: config.showCancelButton,
    confirmButtonColor: config.confirmButtonColor ? config.confirmButtonColor : '#3085d6',
    cancelButtonColor: config.cancelButtonColor ? config.cancelButtonColor : '#d33',
    cancelButtonText: config.cancelButtonText ? config.cancelButtonText : 'Back',
    confirmButtonText: config.confirmButtonText ? config.confirmButtonText : 'Okey',
  }

  cfg = { ...cfg, ...config }

  return window.Swal.fire(cfg)
}

export const OpenSwalConfirm = (config) => {


  return window.Swal.fire({
    title: config.title,
    html: config.html,
    icon: config.icon ? config.icon : 'question',
    showCancelButton: config.showCancelButton ? config.showCancelButton : true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: config.cancelButtonText ? config.cancelButtonText : 'Back',
    confirmButtonText: config.confirmButtonText ? config.confirmButtonText : 'Okey',
  })
}

export const countryCallingCode = (phone) => {
  const phoneNumber = parsePhoneNumber('+' + phone)
  if (phoneNumber) {
    return phoneNumber.countryCallingCode
  }
  return null
}

export function zeroPad(num, places) {

  var negativ = false
  if (num < 0) {
    negativ = true
    num = Math.abs(num)
  }

  var zero = places - num.toString().length + 1;
  return ((negativ) ? "-" : '') + Array(+(zero > 0 && zero)).join("0") + num;
}

export function makeKilo(num) {
  num = num.toString().replace(/[^0-9.]/g, '');
  if (num < 1000) {
    return num;
  }
  let si = [
    { v: 1E3, s: "K" },
    { v: 1E6, s: "M" },
    { v: 1E9, s: "B" },
    { v: 1E12, s: "T" },
    { v: 1E15, s: "P" },
    { v: 1E18, s: "E" }
  ];
  let index;
  for (index = si.length - 1; index > 0; index--) {
    if (num >= si[index].v) {
      break;
    }
  }
  return (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
};

export const StripEmpty = (props) => {
  const { value, type, format } = props
  if (!(typeof (value) === 'undefined') && (value !== 'undefined')) {
    if (!type) {
      if ((value) && (value.length) && (value !== null)) {
        if ((value.replaceAll(/\s/g, '')).length) {
          return value
        }
      }
    } else {
      if ((value) && (value.length) && (value !== null)) {
        switch (type) {
          case 'date':
          case 'datetime':
            return dayjs(value).format(format)
            break;
          default:
            return "-"
            break;
        }
      }
    }
  }


  return "-"
}

export const ErrorsAdaptor = ({ errors }) => {
  if (Array.isArray(errors)) {
    if (errors[0]['key'] && errors[0]['error']) {
      let conts = []
      errors.map((v, k) => {
        conts.push(v.error[0])
      })
      return conts
    } else {
      return errors
    }
  } else {
    return [errors]
  }
}

export const CalcuDuration = ({ start, end, format='' }) => {
  if (start && end) {
    var y = dayjs(start)
    var x = dayjs(end)
    return dayjs.duration(x.diff(y)).format(format)
  } 
}