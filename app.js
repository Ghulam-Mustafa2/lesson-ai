document.getElementById('lessonForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const subject = document.getElementById('subject').value;
    const grade = document.getElementById('grade').value;
    const topic = document.getElementById('topic').value;

    const btn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const resultArea = document.getElementById('resultArea');
    const outputText = document.getElementById('outputText');

    // Loading state
    btn.disabled = true;
    btn.innerHTML = 'Generating...';
    btn.classList.add('opacity-70', 'cursor-not-allowed');
    loading.classList.remove('hidden');
    resultArea.classList.add('hidden');

    // Fake AI API Call (Demo)
    setTimeout(() => {
        const demoResult = `📚 SUBJECT: ${subject}\n🎓 GRADE: ${grade}\n📌 TOPIC: ${topic}\n\n---\n\n**1. Learning Objectives:**\nBy the end of this lesson, students will be able to:\n- Understand the core concepts of ${topic}.\n- Apply this knowledge in real-world scenarios suitable for ${grade}.\n\n**2. Materials Required:**\n- Whiteboard & Markers\n- Printed worksheets\n- Smartboard/Projector (optional)\n\n**3. Introduction (10 Minutes):**\n- Start with a thought-provoking question about ${topic}.\n- Ask students what they already know.\n\n**4. Main Activity (25 Minutes):**\n- Explain the fundamental principles of ${topic}.\n- Break students into small groups for a hands-on activity.\n- Walk around and assist groups as they work.\n\n**5. Assessment & Closure (10 Minutes):**\n- Ask 3 quick questions to gauge understanding.\n- Summarize the key takeaways.\n\n**6. Homework:**\n- Read pages X to Y in the textbook and complete the practice questions.`;

        outputText.textContent = demoResult;
        
        // Reset UI
        loading.classList.add('hidden');
        resultArea.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = 'Generate Lesson Plan';
        btn.classList.remove('opacity-70', 'cursor-not-allowed');
        
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 2000);
});