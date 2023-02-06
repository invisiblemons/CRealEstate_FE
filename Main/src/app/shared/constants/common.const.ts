export const DATE_FORMAT = 'dd-MM-yyyy';
export const DATE_TIME_FORMAT = 'HH:mm, dd-MM-yyyy';
export const FULL_DATE_TIME_FORMAT = 'HH:mm, dd-MM-yyyy';
export const DATE_PICKER_FORMAT = 'dd-mm-yy';
export const TABLE_CONFIG = {
  ROWS_PER_PAGE: [5, 10, 20],
  ROWS: 5,
};
export const CODE_PATTERN = '^[a-zA-Z0-9-_.]*$';
export const POSTFIX_PATTERN = '^[a-zA-Z0-9]*$';
export const TEXTFIELD_PATTERN = '^[a-zA-Z0-9_-\\s]{0,128}$';
export const PHONE_PATTERN = '^[0-9]*$';
export const EMAIL_PATTERN =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Minimum eight characters, at least one letter, one number and one special character
export const PASSWORD_PATTERN =
/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!_%*?&])([a-zA-Z0-9@$!_%*?&]{8,})$/;
// export const PHONE_MAX_LENGTH = 12;
// export const PHONE_MIN_LENGTH = 10;
export const FLOAT = '^[0-9.]*$';
export const AVATAR_DEFAULT = 'assets/img/defaultAvatar.png';
export const IMAGE_DEFAULT = 'assets/img/imageSrc_placeholder.jpg';
// export const MONEY_DEFAULT = 'price | currency:"VND":number:"1.0-2":"vi-VN"'
