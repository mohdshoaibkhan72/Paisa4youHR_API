const { use } = require("bcrypt/promises");
const TeamDto = require("./team-dto");

class UserDto {
  id;
  name;
  dob;
  gender;
  joiningDate;
  empID;
  email;
  username;
  mobile;
  image;
  type;
  address;
  status;
  team;
  //banks deatls
  accountNumber;
  bankName;
  IFSC;

  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.dob = user.dob; // Assigning dob
    this.gender = user.gender; // Assigning gender
    this.joiningDate = user.joiningDate; // Assigning joiningDate
    this.empID = user.empID; // Assigning empID
    this.email = user.email; // Assigning email
    this.username = user.username; // Assigning username
    this.mobile = user.mobile; // Assigning mobile
    this.accountNumber = user.accountNumber;
    this.bankName = user.bankName;
    this.IFSC = user.IFSC;
    this.image = user.image
      ? `${process.env.BASE_URL}/storage/images/profile/${user.image}`
      : null; // Safely handling image URL
    this.type = user.type
      ? user.type.charAt(0).toUpperCase() + user.type.slice(1)
      : null; // Safely handling user type
    this.address = user.address; // Assigning address
    this.status = user.status
      ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
      : null; // Safely handling status
    this.team = user.team
      ? new TeamDto(
          Array.isArray(user.team) && user.team.length > 0
            ? user.team[0]
            : user.team
        )
      : null; // Safely handling team
  }
}

module.exports = UserDto;
