
'use client'

import { getCookie } from "cookies-next";
import CryptoJS from "crypto-js";
import { COOKIE_NAME, SECRET_KEY } from "./app.constans";


export const LabelStatusInstrumen = (props) => {
  let label = ""
  switch (props.status + "") {
    case "1":
      label = <span className="bg-green-400/60 text-green-800 rounded-xl px-2 py-1 inline-block text-center">Available</span>
      break;
    case "2":
      label = <span className="bg-yellow-200/60 text-yellow-800 rounded-xl px-2 py-1 inline-block text-center">In Use</span>
      break;
    case "3":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">Cleaning</span>
      break;
    case "4":
      label = <span className="bg-purple-200/60 text-purple-800 rounded-xl px-2 py-1 inline-block text-center">Setting</span>
      break;
    case "5":
      label = <span className="bg-purple-200/60 text-purple-800 rounded-xl px-2 py-1 inline-block text-center">Sterilisasi</span>
      break;
    case "6":
      label = <span className="bg-red-200/60 text-red-800 rounded-xl px-2 py-1 inline-block text-center">Broken</span>
      break;
    case "12":
      label = <span className="bg-red-200/60 text-red-800 rounded-xl px-2 py-1 inline-block text-center">Booked</span>
      break;
    default:
      break;
  }
  return label;
}

export const LabelStatusPinjam = ({ status, jenis = '' }) => {
  let label = ""
  switch (status + "") {
    case "1":
      label = <span className="bg-orange-400/60 text-orange-800 rounded-xl px-2 py-1 inline-block text-center">Permintaan Baru</span>
      break;
    case "2":
      label = <span className="bg-blue-200/60 text-blue-800 rounded-xl px-2 py-1 inline-block text-center">Dipacking</span>
      break;
    case "3":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">Selesai Packing A1</span>
      break;
    case "4":
      label = <span className="bg-purple-200/60 text-purple-800 rounded-xl px-2 py-1 inline-block text-center">{jenis === 'AHP' ? 'Selesai' : 'Diverifikasi B1'}</span>
      break;
    case "5":
      label = <span className="bg-amber-200/60 text-amber-800 rounded-xl px-2 py-1 inline-block text-center">Dikembalikan B2</span>
      break;
    case "6":
      label = <span className="bg-green-200/60 text-green-800 rounded-xl px-2 py-1 inline-block text-center">Selesai A2</span>
      break;
    case "8":
      label = <span className="bg-red-200/60 text-red-800 rounded-xl px-2 py-1 inline-block text-center">Dibatalkan</span>
      break;
    default:
      break;
  }
  return label;
}

export const LabelStatusReturn = (props) => {
  let label = ""
  switch (props.status + "") {
    case "1":
      label = <span className="bg-orange-400/60 text-white rounded-xl px-2 py-1 inline-block text-center">Pengembalian Baru</span>
      break;
    case "2":
      label = <span className="bg-blue-200/60 text-blue-800 rounded-xl px-2 py-1 inline-block text-center">Diverifikasi</span>
      break;
    case "3":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">Siap Dicuci</span>
      break;
    case "4":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">Sedang Dicuci</span>
      break;
    case "5":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">Uji Bowie</span>
      break;
    case "6":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">Selesai Pinjam</span>
      break;
    case "7":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">Dicuci</span>
      break;
    case "11":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">Selesai Dicuci</span>
      break;
    case "12":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">Disteril</span>
      break;
    case "13":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">Selesai Steril</span>
      break;
    case "14":
      label = <span className="bg-green-200/60 text-green-800 rounded-xl px-2 py-1 inline-block text-center">Finish</span>
      break;
    case "8":
      label = <span className="bg-red-200/60 text-red-800 rounded-xl px-2 py-1 inline-block text-center">Dibatalkan</span>
      break;

    default:
      break;
  }
  return label;
}

export const LabelStatusCleaning = (props) => {
  let label = ""
  switch (props.status + "") {
    case "0":
      label = <span className="bg-orange-400/60 text-white rounded-xl px-2 py-1 inline-block text-center">Perlu Tindakan</span>
      break;
    case "1":
      label = <span className="bg-purple-200/60 text-purple-800 rounded-xl px-2 py-1 inline-block text-center">Sedang Dicuci</span>
      break;
    case "2":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">Selesai Dicuci</span>
      break;

    default:
      break;
  }
  return label;
}

export const LabelStatusSteril = (props) => {
  let label = ""
  switch (props.status + "") {
    case "0":
      label = <span className="bg-orange-400/60 text-white rounded-xl px-2 py-1 inline-block text-center">Perlu Tindakan</span>
      break;
    case "1":
      label = <span className="bg-purple-200/60 text-purple-800 rounded-xl px-2 py-1 inline-block text-center">Sedang Disteril</span>
      break;
    case "2":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">Selesai Disteril</span>
      break;

    default:
      break;
  }
  return label;
}

export const LabelStatusUjibowie = (props) => {
  let label = ""
  switch (props.status + "") {
    case "0":
      label = <span className="bg-orange-400/60 text-white rounded-xl px-2 py-1 inline-block text-center">Perlu Tindakan</span>
      break;
    case "1":
      label = <span className="bg-red-200/60 text-red-800 rounded-xl px-2 py-1 inline-block text-center">Sedang Diuji</span>
      break;
    case "2":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">Selesai</span>
      break;

    default:
      break;
  }
  return label;
}

export const LabelStatusSetting = (props) => {
  let label = ""
  switch (props.status + "") {
    case "0":
      label = <span className="bg-orange-400/60 text-white rounded-xl px-2 py-1 inline-block text-center">Perlu Tindakan</span>
      break;
    case "1":
      label = <span className="bg-blue-200/60 text-purple-800 rounded-xl px-2 py-1 inline-block text-center">Selesai</span>
      break;
    default:
      break;
  }
  return label;
}

export const LabelStatusMesin = (props) => {
  let label = ""
  switch (props.status + "") {
    case "1":
      label = <span className="bg-green-200/60 text-green-500 rounded-xl px-2 py-1 inline-block text-center">Ready</span>
      break;
    case "2":
      label = <span className="bg-orange-200/60 text-orange-500 rounded-xl px-2 py-1 inline-block text-center">Maintenance</span>
      break;
    case "4":
      label = <span className="bg-red-200/60 text-red-500 rounded-xl px-2 py-1 inline-block text-center">Sedang Diuji</span>
      break;

    default:
      break;
  }
  return label;
}

export const LabelLevelUser = (props) => {
  let label = ""
  switch (props.level + "") {
    case "1":
      label = <span className="bg-red-200/60 text-red-500 rounded-xl px-2 py-1 inline-block text-center">Superadmin</span>
      break;
    case "2":
      label = <span className="bg-purple-200/60 text-purple-500 rounded-xl px-2 py-1 inline-block text-center">Admin</span>
      break;
    case "3":
      label = <span className="bg-lime-200/60 text-lime-800 rounded-xl px-2 py-1 inline-block text-center">CSSD</span>
      break;
    case "4":
      label = <span className="bg-blue-200/60 text-blue-500 rounded-xl px-2 py-1 inline-block text-center">Nakes</span>
      break;

    default:
      break;
  }
  return label;
}

export const LabelStatusUser = (props) => {
  let label = ""
  switch (props.status + "") {
    case "1":
      label = <span className="bg-blue-200/60 text-blue-500 rounded-xl px-2 py-1 inline-block text-center">Aktif</span>
      break;
    case "3":
      label = <span className="bg-red-200/60 text-red-500 rounded-xl px-2 py-1 inline-block text-center">Blokir</span>
      break;

    default:
      break;
  }
  return label;
}

export const LabelJenisPinjam = (props) => {
  let label = ""
  switch (props.jenis + "") {
    case "IRU":
      label = <span className="px-4 py-1 rounded-xl border border-blue-400 bg-blue-400 text-white">IRU</span>
      break;
    case "AHP":
      label = <span className="px-4 py-1 rounded-xl border border-orange-400 bg-orange-400 text-white">AHP</span>
      break;

    default:
      break;
  }
  return label;
}

export const encrypt = (text) => {
  try {
    const data = CryptoJS.AES.encrypt(
      text,
      SECRET_KEY
    ).toString();
    return data;
  } catch (err) {
    return null;
  }
}

export const decrypt = (text) => {
  try {
    const bytes = CryptoJS.AES.decrypt(text, SECRET_KEY);
    const data = bytes.toString(CryptoJS.enc.Utf8);
    return data;
  } catch (err) {
    return null
  }
}

export const getUserdata = async (attr) => {
  const data = await getCookie(COOKIE_NAME);
  const userdata = decrypt(data);
  let parsed
  if (userdata) {
    parsed = JSON.parse(userdata);
  }
  if (parsed) {
    if (attr) {
      return parsed[attr]
    }
    return parsed
  }
  return null;
}