"use client"

import React from 'react';
import { Markdown } from './markdown';

export function MathDemo() {
  const mathExamples = [
    {
      title: "Inline Math",
      content: "The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ which solves equations like $ax^2 + bx + c = 0$."
    },
    {
      title: "Display Math",
      content: "The Pythagorean theorem states:\n\n$$a^2 + b^2 = c^2$$\n\nWhere $a$ and $b$ are the legs of a right triangle and $c$ is the hypotenuse."
    },
    {
      title: "Complex Math",
      content: "Euler's identity:\n\n$$e^{i\\pi} + 1 = 0$$\n\nThis combines five fundamental mathematical constants: $e$, $i$, $\\pi$, $1$, and $0$."
    },
    {
      title: "Markdown + Math",
      content: "# Mathematical Concepts\n\n## Calculus\n\nThe derivative of $f(x) = x^2$ is:\n\n$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} = 2x$$\n\n## Linear Algebra\n\nFor a matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, the determinant is:\n\n$$\\det(A) = ad - bc$$\n\n## Code Example\n\n```python\ndef calculate_derivative(f, x, h=0.0001):\n    return (f(x + h) - f(x)) / h\n```"
    },
    {
      title: "Physics Equations",
      content: "## Newton's Second Law\n\n$$F = ma$$\n\n## Einstein's Mass-Energy Equivalence\n\n$$E = mc^2$$\n\n## Schrödinger Equation (Time-independent)\n\n$$\\hat{H}\\psi = E\\psi$$\n\nWhere $\\hat{H}$ is the Hamiltonian operator and $\\psi$ is the wave function."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Math Rendering Demo
        </h1>
        <p className="text-gray-600 text-lg">
          Showcasing LaTeX math equations and markdown rendering capabilities
        </p>
      </div>

      <div className="grid gap-6">
        {mathExamples.map((example, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              {example.title}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <Markdown>{example.content}</Markdown>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          How to Use
        </h3>
        <div className="text-blue-800 space-y-2">
          <p><strong>Inline Math:</strong> Use single dollar signs: <code className="bg-blue-100 px-2 py-1 rounded">$x^2 + y^2$</code></p>
          <p><strong>Display Math:</strong> Use double dollar signs: <code className="bg-blue-100 px-2 py-1 rounded">$$E = mc^2$$</code></p>
          <p><strong>Markdown:</strong> Supports headers, lists, code blocks, links, and more</p>
          <p><strong>Code:</strong> Use triple backticks for code blocks with syntax highlighting</p>
        </div>
      </div>
    </div>
  );
}
