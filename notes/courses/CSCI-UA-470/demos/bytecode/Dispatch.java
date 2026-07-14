// Source of truth for the bytecode column in demos/java-dispatch.jsx.
// The demo shows Shape/Circle plus a top-level fragment; that fragment is a real
// main() here, which is where the invokevirtual opcodes come from.
// Regenerate/verify with: npm run check:bytecode
class Shape {
    void draw() { }
    double area() { return 0; }
}

class Circle extends Shape {
    void draw() { }
}

class Demo {
    public static void main(String[] args) {
        Shape s = new Circle();
        s.draw();
        s.area();
    }
}
