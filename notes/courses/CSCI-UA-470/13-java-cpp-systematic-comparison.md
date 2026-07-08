---
title: "Java vs. C++: Systematic Comparison"
date: "2026-06-24"
---

## Purpose of this review note

This note is a compact comparison checklist for final review. It does not re-teach the Java introduction from [note 08](note.html?course=CSCI-UA-470&note=08-cpp-vs-java), the Java polymorphism/design material from [note 09](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java), the files/serialization/`final` material from [note 10](note.html?course=CSCI-UA-470&note=10-java-files-final), or the JVM/runtime material from [note 11](note.html?course=CSCI-UA-470&note=11-jvm-runtime). Use this note to compare the two languages quickly and to identify common exam traps.

## Where the detailed explanations live

| Topic | Main note |
|---|---|
| Java basics through C++ comparison | [08 - C++ vs. Java](note.html?course=CSCI-UA-470&note=08-cpp-vs-java) |
| Java polymorphism and design | [09 - Polymorphism & Abstract Classes](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java) |
| Files, serialization, and `final` | [10 - Java Files, Serialization & final](note.html?course=CSCI-UA-470&note=10-java-files-final) |
| JVM, bytecode, and runtime architecture | [11 - JVM, Bytecode & Runtime Architecture](note.html?course=CSCI-UA-470&note=11-jvm-runtime) |
| OOP pillars and conceptual roadmap | [14 - OOP Pillars Roadmap](note.html?course=CSCI-UA-470&note=14-oop-pillars-roadmap) |

## Core language comparison

| Category | Java | C++ | Main exam trap |
|---|---|---|---|
| Source files | `.java` | `.cpp` / `.cc` plus `.h` | Java source files compile to bytecode; C++ source files compile toward native code. |
| Runtime target | JVM | Physical machine / OS ABI | Java portability comes from JVMs, not from the `.class` file being native machine code. |
| Organization | Packages | Namespaces | Java package names are tied to directory layout more strongly than C++ namespaces are. |
| Standalone functions | Not allowed | Allowed | In Java, every function-like unit is a method inside a class. |
| Entry point | `public static void main(String[] args)` inside a class | `int main(...)` as a free function | Java `main` is a static method; C++ `main` is not inside a required class. |
| Universal root class | `Object` | No required universal root class | C++ classes are not automatically subclasses of a language-level `Object`. |
| Object creation | Objects are created with `new` and accessed through references | Objects can be direct, pointer-based, reference-based, stack, static, or heap allocated | `Circle c;` is valid C++ but has no direct Java object equivalent. |
| Object cleanup | Garbage collector | Destructor and explicit `delete` / `delete[]` for heap allocations | Java has no C++-style destructor. |

## Type and value model

| Category | Java | C++ | Main exam trap |
|---|---|---|---|
| Primitive integers | `byte`, `short`, `int`, `long` | `char`, `short`, `int`, `long`, plus implementation-dependent variants | Java primitive sizes are fixed; C++ primitive sizes are more platform-dependent. |
| Floating point | `float`, `double` | `float`, `double`, `long double` | C++ has `long double`; Java does not. |
| Boolean type | `boolean` | `bool` | Java `boolean` is not an integer type. |
| Character type | `char` | `char` | Same name, different language context and encoding assumptions. |
| Strings | `String` class | C-style strings or `std::string` | Java `String` variables hold references to string objects. |
| Wrapper classes | Primitive wrappers such as `Integer`, `Double`, `Character` | No required wrapper pattern for ordinary primitive use | Java wrappers are objects; primitives are not objects. |
| Arrays | Objects with length | Raw arrays are not objects | Java arrays know their length; raw C++ arrays do not carry safe length metadata. |

## Variables, objects, pointers, and references

| Category | Java | C++ | Main exam trap |
|---|---|---|---|
| Primitive variable | Stores the primitive value | Stores the primitive value | Primitive assignment copies the value in both languages. |
| Object variable | Stores a reference to an object | Can be an actual object, pointer, or reference | Java object variables are not objects themselves. |
| Explicit pointers | Not supported | Supported with `*` and address values | Java references are pointer-like but do not expose pointer arithmetic. |
| References | Object references can be `null` | C++ references are aliases and must be initialized | A C++ reference is not the same thing as a Java reference. |
| Assignment of object variables | Copies the reference | Depends on whether the variable is an object, pointer, or reference | Java assignment can create aliasing; it does not copy the object. |
| `new` | Allocates an object and returns a reference | Allocates heap memory and returns a pointer | C++ `new int` is valid; Java `new int` is not. |

## Parameter passing

| Case | What gets passed | Consequence |
|---|---|---|
| Java primitive parameter | A copy of the primitive value | Reassigning the parameter does not affect the caller's variable. |
| Java object parameter | A copy of the reference value | Mutating the object can affect the caller; rebinding the local parameter does not. |
| C++ value parameter | A copy of the object or value | Changes affect only the copy. |
| C++ pointer parameter | A copy of the address | The function can mutate the pointed-to object through the pointer. |
| C++ reference parameter | An alias for the caller's variable | Changes affect the original variable directly. |

The common Java swap mistake is to reassign two local reference parameters. That swaps only the local copies of the references, not the caller's variables. To affect the caller-visible objects, mutate their fields or use another wrapper/container strategy.

## Static members and static variables

| Category | Java | C++ | Main exam trap |
|---|---|---|---|
| Static fields / attributes | Supported | Supported | Static fields belong to the class, not to one object. |
| Static methods | Supported | Supported | A static method has no `this` object. |
| Local static variables | Not supported in the C++ sense | Supported inside functions | Saying "Java has no static variables" is imprecise; Java has static fields, but not C++-style local static variables. |
| Global variables | No free-standing globals in the same style | Supported | Java pushes global-like state into classes. |

## Access, friendship, and code organization

| Category | Java | C++ | Main exam trap |
|---|---|---|---|
| Access levels | `public`, `protected`, `private`, package-private/default | `public`, `protected`, `private` | Java default access is package-private, not public. |
| Class member default | Depends on declaration context and modifier | `class` members default to private; `struct` members default to public | C++ `class` and `struct` differ by default member access. |
| Top-level class visibility | `public` or package-private/default | No same direct modifier model | Java usually allows one public top-level class per source file. |
| Friendship | No `friend` mechanism | `friend` functions and classes | Java cannot directly grant C++-style private access to a selected external function/class. |
| Package / namespace | Package | Namespace | Packages also participate in access control through package-private visibility. |

## Inheritance and abstraction

| Category | Java | C++ | Main exam trap |
|---|---|---|---|
| Class inheritance | Single class inheritance | Single or multiple inheritance | Java forbids multiple class inheritance. |
| Interface inheritance | Multiple interface implementation | Multiple inheritance from pure-virtual interface-like classes | Java uses interfaces to get multiple behavioral contracts. |
| Inheritance modes | Effectively public class extension | `public`, `protected`, `private` inheritance | C++ inheritance mode affects how inherited members are exposed. |
| Abstract class syntax | Uses `abstract` | At least one pure virtual function | C++ has no `abstract` keyword. |
| Interface syntax | Uses `interface` | Modeled with pure virtual classes | C++ has no built-in `interface` keyword. |
| Instantiating abstract types | Cannot instantiate; can declare references | Cannot instantiate; can declare pointers/references | The type can be used as a handle type even when no direct object can be created. |
| Diamond problem | Avoided for classes by banning multiple class inheritance | Possible with multiple inheritance; virtual inheritance can solve duplicated base subobjects | Java's interfaces are the usual replacement for multiple class inheritance. |

## Dynamic dispatch

| Category | Java | C++ | Main exam trap |
|---|---|---|---|
| Default method binding | Ordinary instance methods are dynamically dispatched | Member functions are statically bound unless marked `virtual` | Java is virtual-by-default for ordinary instance methods; C++ is not. |
| `virtual` keyword | Not used | Required for late binding of ordinary member functions | Forgetting `virtual` in C++ changes the dispatch behavior. |
| Static methods | Not dynamically dispatched like ordinary instance methods | Cannot be virtual | Static methods belong to the class, not to an object. |
| Private methods | Not overridden in the usual dynamic-dispatch sense | Private virtual functions are possible but not part of normal public interface use | Visibility and dispatch are separate concepts, but private methods are not ordinary override targets in Java. |
| Final methods | Cannot be overridden | No direct identical keyword in older C++; `final` exists for overriding control in modern C++ | Java `final` can block overriding. |
| Constructors | Not virtual | Cannot be virtual | Construction happens before normal dynamic type behavior is fully available. |
| Destructors | No destructors | Destructors can and often should be virtual in polymorphic base classes | In C++, deleting derived objects through base pointers requires a virtual destructor. |

A useful dispatch test is:

> If one call expression may invoke different method bodies depending on the runtime type of the object, the language feature involved is dynamic dispatch.

## Memory management checklist

| Situation | Java answer | C++ answer |
|---|---|---|
| Heap object no longer reachable | Garbage collector may reclaim it later | Programmer must ensure deletion or use RAII/smart pointers. |
| Raw dynamic array | Ordinary Java arrays are GC-managed objects | Use `delete[]`, not `delete`. |
| Object owns heap memory | GC handles object reachability, but logical resources may still need cleanup patterns | Rule of Three/Five: destructor, copy constructor, assignment operator, and possibly move operations. |
| File/socket/resource cleanup | Use structured cleanup patterns such as `try`-with-resources when applicable | Use RAII destructors where possible. |

## Condensed exam table

| Category | Java | C++ |
|---|---|---|
| File structure | `.java` source; `.class` bytecode | `.cpp`/`.cc` source; `.h` headers |
| Compilation | Bytecode plus JVM | Native executable per platform |
| Code organization | Packages | Namespaces |
| Standalone functions | No | Yes |
| `main` | Static method inside a class | Regular free function |
| Parameter passing | Value copy; object references copied | Value, pointer, reference |
| Objects | Accessed through references | Direct objects, pointers, and references |
| Static | Class-level fields/methods | Static members plus local/static/global variables |
| Arrays | Objects | Raw arrays are not objects |
| Pointers | Implicit references only | Explicit pointers and references |
| `new` | Objects only | Any dynamically allocated type |
| Heap cleanup | Garbage collector | Programmer responsibility or RAII abstraction |
| Access | `public`, `protected`, `private`, package-private/default | `public`, `protected`, `private` |
| Friend | No | Yes |
| Inheritance | Single class inheritance, multiple interfaces | Single/multiple inheritance |
| Virtual dispatch | Default for ordinary instance methods | Only with `virtual` |
| Abstract class | `abstract` keyword | At least one pure virtual method |
| Interface | `interface` keyword | Pure-virtual class pattern |
