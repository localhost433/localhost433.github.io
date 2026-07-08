---
title: "Java Files, Serialization & final"
date: "2026-06-22"
---

## Files and data representation

The lecture examples use the data values `'A'`, `"Hi"`, `2`, and `3.4567`.

A **file** is ultimately a sequence of bits stored on disk, but the interpretation of those bits depends on the file format. The lecture splits files into two broad categories:

- **Text files**
- **Binary files**

### Text files

In a **text file**, every datum is first turned into characters, and each character is encoded as bytes, for example using ASCII in the lecture diagram.

| Data value | Stored as text | What is encoded |
|---|---|---|
| `'A'` | `A` | the ASCII code for the character `A` |
| `"Hi"` | `H`, `i` | the ASCII codes for `H` and `i` |
| `2` | `2` | the ASCII code for the character `'2'`, not the integer value `2` |
| `3.4567` | `3`, `.`, `4`, `5`, `6`, `7` | the ASCII codes for the characters in the string `"3.4567"` |

So the number `3.4567` is not stored using a floating-point representation in a text file. It is stored as the characters `3`, `.`, `4`, `5`, `6`, `7` -- that is, the string `"3.4567"`.

That is why text files are readable in a text editor. A text editor reads the bytes, interprets them as character codes, and displays characters.

### Binary files

In a **binary file**, data is stored according to a non-text byte format rather than first being converted into printable characters. This may be a primitive binary format, an object-serialization format, an image format, a compressed format, and so on.

| Data value | Binary-file idea |
|---|---|
| `'A'` | format-defined character representation, for example a code unit or encoded character byte |
| `"Hi"` | format-defined string representation, often including length or metadata |
| `2` | the numeric representation of integer `2`, for example fixed-width two's-complement bits |
| `3.4567` | the numeric representation of a floating-point number, for example IEEE-style floating-point bits |

The key distinction is not that text files contain bits while binary files do not. Both contain bits. The distinction is **what the bits mean**:

- In a text file, the bits usually mean characters.
- In a binary file, the bits may mean integers, floating-point numbers, serialized objects, images, compressed data, etc.

Because a binary file is not necessarily a sequence of printable character codes, opening a `.bin` file in a text editor usually gives unreadable or misleading output.

```artifact src=demos/file-text-vs-binary.jsx
```

## Java text-file I/O

The lecture uses `java.io.*` and `java.util.*`.

### Writing a text file

A common pattern is:

```java
import java.io.*;
import java.util.*;

File f = new File("path/name");

try {
    FileWriter fw = new FileWriter(f, true);  // true means append
    fw.write("some text\n");
    fw.close();
} catch (Exception e) {
    // handle the error
}
```

Important points:

- `File f = new File("path/name");` creates a Java `File` object representing a path. It does not by itself write data.
- `new FileWriter(f, true)` opens the file for writing in append mode.
- `fw.write(...)` writes characters.
- `fw.close()` releases the file resource.
- File operations can fail, so the lecture wraps them in `try` / `catch`.

### Reading a text file

A common pattern is:

```java
import java.io.*;
import java.util.*;

File f = new File("path/name");

try {
    Scanner s = new Scanner(f);

    while (s.hasNext()) {
        String l = s.nextLine();
        // use l
    }

    s.close();
} catch (Exception e) {
    // handle the error
}
```

Important points:

- `Scanner` reads tokens or lines from a file.
- `s.hasNext()` checks whether there is more input.
- `s.nextLine()` reads the next whole line as a `String`.
- `s.close()` releases the resource.

## Java binary-file I/O and serialization

For binary files, the lecture uses Java **object serialization**.

A class whose objects are written by `ObjectOutputStream` must implement `Serializable`:

```java
import java.io.Serializable;

class Circle implements Serializable {
    // fields and methods
}
```

`Serializable` is a marker interface: it tells Java that objects of this class are allowed to be serialized.

### Writing binary data

The lecture pattern is:

```java
import java.io.*;

class Circle implements Serializable {
    // fields and methods
}

class Main {
    public static void main(String[] args) {
        Integer x = 10;
        Circle c = new Circle();

        try {
            FileOutputStream fs = new FileOutputStream("path/name");
            ObjectOutputStream os = new ObjectOutputStream(fs);

            os.writeObject(x);
            os.writeObject(c);

            os.close();
            fs.close();
        } catch (Exception e) {
            // handle the error
        }
    }
}
```

Important points:

- `FileOutputStream` writes bytes to a file.
- `ObjectOutputStream` sits on top of that stream and writes whole Java objects.
- `os.writeObject(x)` serializes the `Integer` object.
- `os.writeObject(c)` serializes the `Circle` object.
- The order of writing matters, because reading must use the same order.

### Reading binary data

The matching reading pattern is:

```java
import java.io.*;

class Circle implements Serializable {
    // fields and methods
}

class Main {
    public static void main(String[] args) {
        try {
            FileInputStream fs = new FileInputStream("path/name");
            ObjectInputStream is = new ObjectInputStream(fs);

            Integer i = (Integer) is.readObject();
            Circle cir = (Circle) is.readObject();

            is.close();
            fs.close();
        } catch (Exception e) {
            // handle the error
        }
    }
}
```

Important points:

- `FileInputStream` reads bytes from a file.
- `ObjectInputStream` reconstructs objects from those bytes.
- `readObject()` returns type `Object`, so explicit casts are needed.
- The first read must match the first written object, the second read must match the second written object, and so on.

```artifact src=demos/serialization-stream-order.jsx
```

## The keyword `final`

The Java keyword `final` means that something is restricted from further change. The exact restriction depends on where `final` is used.

| Use of `final` | Meaning | Restriction |
|---|---|---|
| `final` attribute / variable | the variable cannot be reassigned after initialization | mutation of the binding is forbidden |
| `final` method | the method cannot be overridden by subclasses | override restriction |
| `final` class | the class cannot be subclassed | inheritance restriction |

### Final attributes

```java
class Circle {
    final double PI = 3.1415926535;
}
```

After a `final` field is initialized, it cannot be assigned again.

For object references, this distinction matters:

```java
final Circle c = new Circle();
```

The reference variable `c` cannot be reassigned to point to a different `Circle`, but the object itself may still be mutable unless its fields or methods prevent mutation.

### Final methods

```java
class Shape {
    public final void id() {
        System.out.println("shape");
    }
}

class Circle extends Shape {
    // public void id() { }   // illegal: cannot override a final method
}
```

A `final` method is inherited, but subclasses cannot replace its implementation.

### Final classes

```java
final class Utility {
    // helper code
}

// class MyUtility extends Utility { }   // illegal
```

A `final` class cannot be extended.

```artifact src=demos/java-final-restrictions.jsx
```

`final` is often compared to C++ `const`, but they are not the same tool, and neither one alone makes an object *immutable*. It helps to line up all three by asking what each actually freezes:

```artifact src=demos/const-final-immutable.jsx static
```

## What to retain from L10

For exam-style questions, the most important distinctions are:

| Topic | Key test point |
|---|---|
| Text vs binary files | text stores character encodings; binary can store numeric/object representations directly |
| Java text I/O | `File`, `FileWriter`, `Scanner`, `try` / `catch`, `close()` |
| Java binary I/O | `Serializable`, `FileOutputStream`, `ObjectOutputStream`, `FileInputStream`, `ObjectInputStream`, casts after `readObject()` |
| `final` | final variable = cannot reassign; final method = cannot override; final class = cannot extend |
