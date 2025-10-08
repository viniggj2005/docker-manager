package functions

import (
	"bytes"
	"io"
	"regexp"
	"strconv"
	"strings"

	"github.com/docker/docker/pkg/stdcopy"
)

func LogsTreatment(logs io.ReadCloser) string {

	raw, _ := io.ReadAll(logs)
	isMux := len(raw) >= 8 && (raw[0] == 0 || raw[0] == 1 || raw[0] == 2) && raw[1] == 0 && raw[2] == 0 && raw[3] == 0

	var out string
	if isMux {
		var stdout, stderr bytes.Buffer
		_, _ = stdcopy.StdCopy(&stdout, &stderr, bytes.NewReader(raw))
		out = stdout.String() + stderr.String()
	} else {
		out = string(raw)
	}

	reANSI := regexp.MustCompile(`\x1B\[[0-9;]*[A-Za-z]`)
	out = reANSI.ReplaceAllString(out, "")

	reMethod := regexp.MustCompile(`\b(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b`)
	reStatus := regexp.MustCompile(`\b([1-5][0-9]{2})\b`)
	reIP := regexp.MustCompile(`\b\d{1,3}(?:\.\d{1,3}){3}\b`)
	reTs := regexp.MustCompile(`\b(?:\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?|\d{1,2}/\d{1,2}/\d{2,4}\s+\d{1,2}:\d{2}:\d{2}(?:\s?[AP]M)?)\b`)

	// 1) STATUS antes de método
	out = reStatus.ReplaceAllStringFunc(out, func(m string) string {
		code, _ := strconv.Atoi(m)
		switch {
		case code >= 500:
			return `<span class="text-red-500 font-semibold">` + m + `</span>`
		case code >= 400:
			return `<span class="text-rose-400 font-semibold">` + m + `</span>`
		case code >= 300:
			return `<span class="text-amber-300">` + m + `</span>`
		default:
			return `<span class="text-emerald-400">` + m + `</span>`
		}
	})

	// 2) MÉTODO
	out = reMethod.ReplaceAllStringFunc(out, func(m string) string {
		switch m {
		case "GET":
			return `<span class="text-emerald-400">GET</span>`
		case "POST":
			return `<span class="text-cyan-400">POST</span>`
		case "PUT":
			return `<span class="text-amber-300">PUT</span>`
		case "PATCH":
			return `<span class="text-yellow-300">PATCH</span>`
		case "DELETE":
			return `<span class="text-rose-400 font-semibold">DELETE</span>`
		default:
			return m
		}
	})

	// 3) IP e timestamp
	out = reIP.ReplaceAllString(out, `<span class="text-emerald-300">$0</span>`)
	out = reTs.ReplaceAllString(out, `<span class="text-sky-400">$0</span>`)

	// 4) quebras de linha
	out = strings.ReplaceAll(out, "\n", "<br>")
	return out
}
