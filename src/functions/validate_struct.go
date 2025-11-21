package functions

import (
	"errors"
	"reflect"
)

func ValidateStruct(structure interface{}) error {
	value := reflect.ValueOf(structure)
	for index := 0; index < value.NumField(); index++ {
		field := value.Field(index)
		if field.Kind() == reflect.String && field.String() == "" {
			return errors.New("campo obrigatório vazio")
		}
	}
	return nil
}
