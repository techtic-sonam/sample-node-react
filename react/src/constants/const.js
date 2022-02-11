export const GET_NEW_TOKEN_SUCCESS = 'GET_NEW_TOKEN_SUCCESS'
export const FAIL_AUTH_REQUEST = 'FAIL_AUTH_REQUEST'
export const RESET_AUTH_TOKEN = 'RESET_AUTH_TOKEN'

export const GET_USER_NUMBER = 'GET_USER_NUMBER'
export const GET_USER_DATA = 'GET_USER_DATA'
export const GET_ACCOUNT_DATA = 'GET_ACCOUNT_DATA'
export const SET_LOADING_USER_DATA = 'SET_LOADING_USER_DATA'
export const GET_ALL_MESSAGES = 'GET_ALL_MESSAGES'
export const GET_ALL_USERS = 'GET_ALL_USERS'
export const SET_MEM_NUMBER = 'SET_MEM_NUMBER'
export const NEW_MESSAGE = 'NEW_MESSAGE'
export const GET_ALL_CALLFLOW = 'GET_ALL_CALLFLOW'
export const GET_MEMBER_USERS = 'GET_MEMBER_USERS'

export const GET_ALL_VOICEMAILS = 'GET_ALL_VOICEMAILS'
export const GET_ALL_HOME = 'GET_ALL_HOME'
export const SMS_NOTIFICATION = 'SMS_NOTIFICATION'
export const GET_CALL_FORWARD = 'GET_CALL_FORWARD'
export const GET_ALL_MAINVOICEMAILS = 'GET_ALL_MAINVOICEMAILS'

export const FORGOT_PASSWORD_FAIL = 'FORGOT_PASSWORD_FAIL'
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS'
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS'
export const RESET_PASSWORD_FAIL = 'RESET_PASSWORD_FAIL'

export const GET_USER_DEVICES = 'GET_USER_DEVICES'
export const GET_FOLLOW_DEVICES = 'GET_FOLLOW_DEVICES'
export const GET_NUMBER = 'GET_NUMBER'
export const GET_DEVICES_NAME_PHONE = 'GET_DEVICES_NAME_PHONE'
export const GET_AUTOMATIONS = 'GET_AUTOMATIONS'

export const GET_ACTIVE_CALLS = 'GET_ACTIVE_CALLS'
export const GET_CALL_HISTORY = 'GET_CALL_HISTORY'
export const GET_ADMINDID_NUMBERS = 'GET_ADMINDID_NUMBERS'
export const GET_ADMINDID_USERS = 'GET_ADMINDID_USERS'
export const GET_ADMINDID_GROUPUSERS = 'GET_ADMINDID_GROUPUSERS'

// export const GET_CNAM = 'GET_CNAM'
export const SAVE_CNAM_ERRORS = 'SAVE_CNAM_ERRORS'

export const SAVE_E911_ERRORS = 'SAVE_E911_ERRORS'

export const GET_ALL_DEVICES = 'GET_ALL_DEVICES'
export const GET_ALL_NUMBERS = 'GET_ALL_NUMBERS'
export const GET_CALL_HISTORY_DETAILS = 'GET_CALL_HISTORY_DETAILS'
export const GET_PREFLOW = 'GET_PREFLOW'
export const SAVE_CALL_FLOW = 'SAVE_CALL_FLOW'
export const GET_CALL_FLOWS = 'GET_CALL_FLOWS'
export const GET_MESSAGE_REPORT = 'GET_MESSAGE_REPORT'
export const GET_TOP_SENDER = 'GET_TOP_SENDER'
export const SAVE_CALL_NOTES = 'SAVE_CALL_NOTES'
export const GET_CALL_NOTES = 'GET_CALL_NOTES'

export const GET_ALL_INCOMING_FAXES = 'GET_ALL_INCOMING_FAXES'
export const GET_ALL_INBOX_FAXES = 'GET_ALL_INBOX_FAXES'
export const GET_ALL_OUTBOX_FAXES = 'GET_ALL_OUTBOX_FAXES'
export const GET_FAX_DETAILS = 'GET_FAX_DETAILS'
export const FAXBOX_NUMBERS = 'FAXBOX_NUMBERS'
export const GET_ASSIGN_CONVERSATION = 'GET_ASSIGN_CONVERSATION'
export const GET_ASSIGN_CONVERSATIONS = 'GET_ASSIGN_CONVERSATIONS'
export const GET_ALL_CALLS = 'GET_ALL_CALLS'
export const GET_CALL_DETAILS = 'GET_CALL_DETAILS'

export const GET_ALL_CONTACTS = 'GET_ALL_CONTACTS'
export const SYNC_ALL_CONTACTS = 'SYNC_ALL_CONTACTS'
export const GOOGLE_OAUTH2 = 'GOOGLE_OAUTH2'
export const GET_ALL_CONTACTS_BYID = 'GET_ALL_CONTACTS_BYID'

export const CLIO_CONTACTS = 'CLIO_CONTACTS'
export const CLIO_SYNC_STATE = 'CLIO_SYNC_STATE'
export const CLIO_AUTH_TOKEN = 'CLIO_AUTH_TOKEN'

export const USER_NUMBERS = 'USER_NUMBERS'
export const GET_USERS = 'GET_USERS'
export const USER_CALL_FORWARD = 'USER_CALL_FORWARD'
export const USER_FOLLOW_DEVICES = 'USER_FOLLOW_DEVICES'
export const USER_DEVICES = 'USER_DEVICES'
export const USER_DEVICES_NAME = 'USER_DEVICES_NAME'
export const USER_FOLLOW_ID = 'USER_FOLLOW_ID'
export const USER_FOLLOW_DATA = 'USER_FOLLOW_DATA'
export const USER_DIRECTORIES = 'USER_DIRECTORIES'
export const RESET_PRESENCE_STATUS = 'RESET_PRESENCE_STATUS'

export const SET_ASSIGN_MEMBER = 'SET_ASSIGN_MEMBER'
export const EMPTY_VOICEMAIL_LIST_MESSAGE = 'No Voicemail records found.'
export const EMPTY_CALL_LIST_MESSAGE = 'No Call records found.'
export const EMPTY_MSG_LIST_MESSAGE = 'No Messages records found.'

export const GET_ALL_ASSIGNED_NUMBERS = 'GET_ALL_ASSIGNED_NUMBERS'
export const GET_ALL_ASSIGNED_MESSAGES = 'GET_ALL_ASSIGNED_MESSAGES'
export const GET_ASSIGN_CONVERSATIONS_LOGS = 'GET_ASSIGN_CONVERSATIONS_LOGS'

export const GET_CALL_REPORTS = 'GET_CALL_REPORTS'

export const SET_CONVERSATION_PAGINATION_NUM = 'SET_CONVERSATION_PAGINATION_NUM'
export const SET_UNREADCONVERSATION_PAGINATION_NUM = 'SET_UNREADCONVERSATION_PAGINATION_NUM'
export const SET_FAVCONVERSATION_PAGINATION_NUM = 'SET_FAVCONVERSATION_PAGINATION_NUM'
export const SET_ASSIGNCONVERSATION_PAGINATION_NUM = 'SET_ASSIGNCONVERSATION_PAGINATION_NUM'

export const GET_ALL_DISTRIBUTION_LIST = 'GET_ALL_DISTRIBUTION_LIST'
export const GET_ALL_DISTRIBUTION_CONTACTS_LIST = 'GET_ALL_DISTRIBUTION_CONTACTS_LIST'
export const GET_ALL_DISTRIBUTION_CONTACTS = 'GET_ALL_DISTRIBUTION_CONTACTS'

export const SET_SIP_CREDENTIALS = 'SET_SIP_CREDENTIALS'

// Mimetypes
export const imageFileMimeTypes = [
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'image/x-icon',
]

export const applicationFileMimeTypes = [
  'application/json',
  'application/ogg',
  'application/pdf',
  'application/rtf',
  'application/zip',
  'application/x-tar',
  'application/xml',
  'application/gzip',
  'application/x-bzip2',
  'application/x-gzip',
  'application/smil',
  'application/javascript',
]

export const audioFileMimeTypes = [
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'audio/flac',
  'audio/webm',
  'audio/wav',
  'audio/amr',
  'audio/3gpp',
  'audio/wave',
]

export const textFileMimeTypes = [
  'text/css',
  'text/csv',
  'text/html',
  'text/calendar',
  'text/plain',
  'text/javascript',
  'text/vcard',
  'text/vnd.wap.wml',
  'text/xml',
]

export const videoFileMimeTypes = [
  'video/avi',
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/quicktime',
  'video/webm',
  'video/x-ms-wmv',
  'video/x-flv',
  'video/3gpp',
  'video/3gp',
]

export const timezone = [
  'Africa/Abidjan',
  'Africa/Accra',
  'Africa/Addis_Ababa',
  'Africa/Algiers',
  'Africa/Asmera',
  'Africa/Bamako',
  'Africa/Bangui',
  'Africa/Banjul',
  'Africa/Bissau',
  'Africa/Blantyre',
  'Africa/Brazzaville',
  'Africa/Bujumbura',
  'Africa/Cairo',
  'Africa/Casablanca',
  'Africa/Ceuta',
  'Africa/Conakry',
  'Africa/Dakar',
  'Africa/Dar_es_Salaam',
  'Africa/Djibouti',
  'Africa/Douala',
  'Africa/El_Aaiun',
  'Africa/Freetown',
  'Africa/Gaborone',
  'Africa/Harare',
  'Africa/Johannesburg',
  'Africa/Kampala',
  'Africa/Khartoum',
  'Africa/Kigali',
  'Africa/Kinshasa',
  'Africa/Lagos',
  'Africa/Libreville',
  'Africa/Lome',
  'Africa/Luanda',
  'Africa/Lubumbashi',
  'Africa/Lusaka',
  'Africa/Malabo',
  'Africa/Maputo',
  'Africa/Maseru',
  'Africa/Mbabane',
  'Africa/Mogadishu',
  'Africa/Monrovia',
  'Africa/Nairobi',
  'Africa/Ndjamena',
  'Africa/Niamey',
  'Africa/Nouakchott',
  'Africa/Ouagadougou',
  'Africa/Porto-Novo',
  'Africa/Sao_Tome',
  'Africa/Timbuktu',
  'Africa/Tripoli',
  'Africa/Tunis',
  'Africa/Windhoek',
  'America/Adak',
  'America/Anchorage',
  'America/Anguilla',
  'America/Antigua',
  'America/Araguaina',
  'America/Aruba',
  'America/Asuncion',
  'America/Barbados',
  'America/Belem',
  'America/Belize',
  'America/Boa_Vista',
  'America/Bogota',
  'America/Boise',
  'America/Buenos_Aires',
  'America/Cambridge_Bay',
  'America/Cancun',
  'America/Caracas',
  'America/Catamarca',
  'America/Cayenne',
  'America/Cayman',
  'America/Chicago',
  'America/Chihuahua',
  'America/Cordoba',
  'America/Costa_Rica',
  'America/Cuiaba',
  'America/Curacao',
  'America/Danmarkshavn',
  'America/Dawson',
  'America/Dawson_Creek',
  'America/Denver',
  'America/Detroit',
  'America/Dominica',
  'America/Edmonton',
  'America/Eirunepe',
  'America/El_Salvador',
  'America/Fortaleza',
  'America/Glace_Bay',
  'America/Godthab',
  'America/Goose_Bay',
  'America/Grand_Turk',
  'America/Grenada',
  'America/Guadeloupe',
  'America/Guatemala',
  'America/Guayaquil',
  'America/Guyana',
  'America/Halifax',
  'America/Havana',
  'America/Hermosillo',
  'America/Indiana/Indianapolis',
  'America/Indiana/Knox',
  'America/Indiana/Marengo',
  'America/Indiana/Vevay',
  'America/Indianapolis',
  'America/Inuvik',
  'America/Iqaluit',
  'America/Jamaica',
  'America/Jujuy',
  'America/Juneau',
  'America/Kentucky/Louisville',
  'America/Kentucky/Monticello',
  'America/La_Paz',
  'America/Lima',
  'America/Los_Angeles',
  'America/Louisville',
  'America/Maceio',
  'America/Managua',
  'America/Manaus',
  'America/Martinique',
  'America/Mazatlan',
  'America/Mendoza',
  'America/Menominee',
  'America/Merida',
  'America/Mexico_City',
  'America/Miquelon',
  'America/Monterrey',
  'America/Montevideo',
  'America/Montreal',
  'America/Montserrat',
  'America/Nassau',
  'America/New_York',
  'America/Nipigon',
  'America/Nome',
  'America/Noronha',
  'America/North_Dakota/Center',
  'America/Panama',
  'America/Pangnirtung',
  'America/Paramaribo',
  'America/Phoenix',
  'America/Port-au-Prince',
  'America/Port_of_Spain',
  'America/Porto_Velho',
  'America/Puerto_Rico',
  'America/Rainy_River',
  'America/Rankin_Inlet',
  'America/Recife',
  'America/Regina',
  'America/Rio_Branco',
  'America/Rosario',
  'America/Santiago',
  'America/Santo_Domingo',
  'America/Sao_Paulo',
  'America/Scoresbysund',
  'America/Shiprock',
  'America/St_Johns',
  'America/St_Kitts',
  'America/St_Lucia',
  'America/St_Thomas',
  'America/St_Vincent',
  'America/Swift_Current',
  'America/Tegucigalpa',
  'America/Thule',
  'America/Thunder_Bay',
  'America/Tijuana',
  'America/Tortola',
  'America/Vancouver',
  'America/Whitehorse',
  'America/Winnipeg',
  'America/Yakutat',
  'America/Yellowknife',
  'Antarctica/Casey',
  'Antarctica/Davis',
  'Antarctica/DumontDUrville',
  'Antarctica/Mawson',
  'Antarctica/McMurdo',
  'Antarctica/Palmer',
  'Antarctica/South_Pole',
  'Antarctica/Syowa',
  'Antarctica/Vostok',
  'Arctic/Longyearbyen',
  'Asia/Aden',
  'Asia/Almaty',
  'Asia/Amman',
  'Asia/Anadyr',
  'Asia/Aqtau',
  'Asia/Aqtobe',
  'Asia/Ashgabat',
  'Asia/Baghdad',
  'Asia/Bahrain',
  'Asia/Baku',
  'Asia/Bangkok',
  'Asia/Beirut',
  'Asia/Bishkek',
  'Asia/Brunei',
  'Asia/Calcutta',
  'Asia/Choibalsan',
  'Asia/Chongqing',
  'Asia/Colombo',
  'Asia/Damascus',
  'Asia/Dhaka',
  'Asia/Dili',
  'Asia/Dubai',
  'Asia/Dushanbe',
  'Asia/Gaza',
  'Asia/Harbin',
  'Asia/Hong_Kong',
  'Asia/Hovd',
  'Asia/Irkutsk',
  'Asia/Istanbul',
  'Asia/Jakarta',
  'Asia/Jayapura',
  'Asia/Jerusalem',
  'Asia/Kabul',
  'Asia/Kamchatka',
  'Asia/Karachi',
  'Asia/Kashgar',
  'Asia/Katmandu',
  'Asia/Krasnoyarsk',
  'Asia/Kuala_Lumpur',
  'Asia/Kuching',
  'Asia/Kuwait',
  'Asia/Macao',
  'Asia/Macau',
  'Asia/Magadan',
  'Asia/Makassar',
  'Asia/Manila',
  'Asia/Muscat',
  'Asia/Nicosia',
  'Asia/Novosibirsk',
  'Asia/Omsk',
  'Asia/Oral',
  'Asia/Phnom_Penh',
  'Asia/Pontianak',
  'Asia/Pyongyang',
  'Asia/Qyzylorda',
  'Asia/Qatar',
  'Asia/Rangoon',
  'Asia/Riyadh',
  'Asia/Saigon',
  'Asia/Sakhalin',
  'Asia/Samarkand',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Taipei',
  'Asia/Tashkent',
  'Asia/Tbilisi',
  'Asia/Tehran',
  'Asia/Thimphu',
  'Asia/Tokyo',
  'Asia/Ujung_Pandang',
  'Asia/Ulaanbaatar',
  'Asia/Urumqi',
  'Asia/Vientiane',
  'Asia/Vladivostok',
  'Asia/Yakutsk',
  'Asia/Yekaterinburg',
  'Asia/Yerevan',
  'Atlantic/Azores',
  'Atlantic/Bermuda',
  'Atlantic/Canary',
  'Atlantic/Cape_Verde',
  'Atlantic/Faeroe',
  'Atlantic/Jan_Mayen',
  'Atlantic/Madeira',
  'Atlantic/Reykjavik',
  'Atlantic/South_Georgia',
  'Atlantic/St_Helena',
  'Atlantic/Stanley',
  'Australia/Adelaide',
  'Australia/Brisbane',
  'Australia/Broken_Hill',
  'Australia/Darwin',
  'Australia/Hobart',
  'Australia/Lindeman',
  'Australia/Lord_Howe',
  'Australia/Melbourne',
  'Australia/Perth',
  'Australia/Sydney',
  'Europe/Amsterdam',
  'Europe/Andorra',
  'Europe/Athens',
  'Europe/Belfast',
  'Europe/Belgrade',
  'Europe/Berlin',
  'Europe/Bratislava',
  'Europe/Brussels',
  'Europe/Bucharest',
  'Europe/Budapest',
  'Europe/Chisinau',
  'Europe/Copenhagen',
  'Europe/Dublin',
  'Europe/Gibraltar',
  'Europe/Helsinki',
  'Europe/Istanbul',
  'Europe/Kaliningrad',
  'Europe/Kiev',
  'Europe/Lisbon',
  'Europe/Ljubljana',
  'Europe/London',
  'Europe/Luxembourg',
  'Europe/Madrid',
  'Europe/Malta',
  'Europe/Minsk',
  'Europe/Monaco',
  'Europe/Moscow',
  'Europe/Nicosia',
  'Europe/Oslo',
  'Europe/Paris',
  'Europe/Prague',
  'Europe/Riga',
  'Europe/Rome',
  'Europe/Samara',
  'Europe/San_Marino',
  'Europe/Sarajevo',
  'Europe/Simferopol',
  'Europe/Skopje',
  'Europe/Sofia',
  'Europe/Stockholm',
  'Europe/Tallinn',
  'Europe/Tirane',
  'Europe/Uzhgorod',
  'Europe/Vaduz',
  'Europe/Vatican',
  'Europe/Vienna',
  'Europe/Vilnius',
  'Europe/Warsaw',
  'Europe/Zagreb',
  'Europe/Zaporozhye',
  'Europe/Zurich',
  'Indian/Antananarivo',
  'Indian/Chagos',
  'Indian/Christmas',
  'Indian/Cocos',
  'Indian/Comoro',
  'Indian/Kerguelen',
  'Indian/Mahe',
  'Indian/Maldives',
  'Indian/Mauritius',
  'Indian/Mayotte',
  'Indian/Reunion',
  'Pacific/Apia',
  'Pacific/Auckland',
  'Pacific/Chatham',
  'Pacific/Easter',
  'Pacific/Efate',
  'Pacific/Enderbury',
  'Pacific/Fakaofo',
  'Pacific/Fiji',
  'Pacific/Funafuti',
  'Pacific/Galapagos',
  'Pacific/Gambier',
  'Pacific/Guadalcanal',
  'Pacific/Guam',
  'Pacific/Honolulu',
  'Pacific/Johnston',
  'Pacific/Kiritimati',
  'Pacific/Kosrae',
  'Pacific/Kwajalein',
  'Pacific/Majuro',
  'Pacific/Marquesas',
  'Pacific/Midway',
  'Pacific/Nauru',
  'Pacific/Niue',
  'Pacific/Norfolk',
  'Pacific/Noumea',
  'Pacific/Pago_Pago',
  'Pacific/Palau',
  'Pacific/Pitcairn',
  'Pacific/Ponape',
  'Pacific/Port_Moresby',
  'Pacific/Rarotonga',
  'Pacific/Saipan',
  'Pacific/Tahiti',
  'Pacific/Tarawa',
  'Pacific/Tongatapu',
  'Pacific/Truk',
  'Pacific/Wake',
  'Pacific/Wallis',
  'Pacific/Yap',
]
