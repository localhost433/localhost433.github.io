---
title: Command-Line Arguments and File I/O
date:
---

## Command-line arguments

When a program is launched from the terminal, arguments after the program name are passed into `main`.

### Extended main signature

```c
int main(int argc, char *argv[]) {
    // ...
}
```

- `argc` is the argument count (an `int`).
  - It is at least 1, because `argv[0]` is the program name.
- `argv` is an array of `char *` (strings).
  - `argv[0]` is the program name.
  - `argv[1]` is the first user argument.
  - Valid indices run from 0 to `argc - 1`.

Example:

Command:

```bash
./a.out James Tara
```

Values:

- `argc == 3`
- `argv[0]` is `"./a.out"`.
- `argv[1]` is `"James"`.
- `argv[2]` is `"Tara"`.

### Safe argument handling

Always check `argc` before using `argv[i]`:

```c
int main(int argc, char *argv[]) {
    if (argc < 3) {
        printf("Usage: %s <name1> <name2>\n", argv[0]);
        return 1;
    }

    printf("welcome for %s\n", argv[1]);
    printf("hi for %s\n", argv[2]);
    return 0;
}
```

If you access `argv[1]` when `argc == 1`, you dereference memory that does not belong to the program.

## Text file I/O

Text files store characters; numbers are written as digit characters, not as binary representations.

### Writing text files

Standard pattern:

1. Open a file with `fopen` in write mode.
2. Write to it with `fprintf`, `fputs`, or `fputc`.
3. Close it with `fclose`.

Example:

```c
FILE *f = fopen(argv[1], "w");
if (f == NULL) {
    printf("Error opening file\n");
    return 1;
}

char *text = "welcome everyone\nThank you.. ";
fprintf(f, "%s", text);

fclose(f);
```

### Reading text files

Standard pattern:

1. Open the file in read mode.
2. Use `fgets` or similar to read content.
3. Close the file.

Example:

```c
FILE *f = fopen(argv[1], "r");
if (f == NULL) {
    printf("Error opening file\n");
    return 1;
}

char line[100];
while (fgets(line, sizeof line, f) != NULL) {
    printf("%s", line);
}

fclose(f);
```

Notes on `fgets`:

- Reads up to `n - 1` characters into the buffer.
- Stops at newline or end of file.
- Always null terminates the string.
- Returns `NULL` at end of file or on error, which is suitable as a loop condition.

### Common text I/O functions

- `fputc(c, f)` writes a single character.
- `fputs(s, f)` writes a string.
- `fprintf(f, format, ...)` writes formatted text.
- `fgetc(f)` reads one character.
- `fgets(buf, n, f)` reads a line into `buf`.
- `fscanf(f, format, ...)` reads formatted input.

## Binary file I/O

Binary files store raw bytes, not human-readable characters.

### Writing binary files

Use `fopen` with mode `"wb"` and `fwrite`:

```c
FILE *f = fopen("data.bin", "wb");
if (f == NULL) {
    // handle error
}

int arr[3] = {1, 2, 3};
size_t written = fwrite(arr, sizeof(int), 3, f);

fclose(f);
```

- `fwrite` writes raw bytes from `arr` into the file.
- In this example the file contains `3 * sizeof(int)` bytes.

### Reading binary files

Use `"rb"` and `fread`:

```c
FILE *f = fopen("data.bin", "rb");
if (f == NULL) {
    // handle error
}

int arr[3];
size_t count = fread(arr, sizeof(int), 3, f);

fclose(f);
```

Binary I/O is useful when performance and exact byte layouts matter (for example saving arrays or structures).

## Summary

- Command-line arguments let the user supply filenames and options at runtime instead of hardcoding them.
- `argc` and `argv` expose those arguments in `main`.
- Text I/O uses character encodings and is human-friendly.
- Binary I/O reads and writes raw memory representations and is space and time efficient but not human-readable.
