package dtos

type LoginInputDto struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponseDto struct {
	Token string  `json:"token"`
	User  UserDTO `json:"user"`
}
