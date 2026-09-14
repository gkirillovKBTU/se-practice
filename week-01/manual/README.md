From this manual directory, pass the complete comma-separated list as one quoted argument:

```sh
go run main.go "85, 23, 45, 90, 92"
```

Alternatively, build and run it:

```sh
go build -o marks-stats main.go
./marks-stats "85, 23, 45, 90, 92"
```

On Windows, run `marks-stats.exe` instead of `./marks-stats`.
