export const threadQuizData = {
  "quizId": "os-threads-v1",
  "sourceDocumentId": "os-threads-pdf-001",
  "generationDate": "2024-06-20T10:00:00Z",
  "questions": [
    // --- Multiple Choice Questions (MCQ) ---
    {
      "questionId": "mcq-001",
      "type": "MCQ",
      "text": "Which term is often used to describe a thread in contrast to a process?",
      "difficulty": "Easy",
      "options": ["Heavyweight Process", "Kernel Context", "Lightweight Process", "Virtual Memory Unit"],
      "correctOptionIndex": 2,
      "modelAnswer": "A thread is commonly referred to as a 'lightweight process' because it requires fewer resources and less overhead than creating a full process.",
      "sourceReference": "Section: What is a Thread?"
    },
    {
      "questionId": "mcq-002",
      "type": "MCQ",
      "text": "Which resource is typically shared among threads belonging to the same process?",
      "difficulty": "Easy",
      "options": ["Thread ID", "Program Counter (PC)", "Stack", "Heap Memory"],
      "correctOptionIndex": 3,
      "modelAnswer": "All threads within a process share the heap memory, code section, and data section.",
      "sourceReference": "Section: Components of a Thread"
    },
    {
      "questionId": "mcq-003",
      "type": "MCQ",
      "text": "The One-to-One threading model maps:",
      "difficulty": "Medium",
      "options": ["Many User Threads to one Kernel Thread.", "Each User Thread to a separate Kernel Thread.", "Many User Threads to a smaller number of Kernel Threads.", "One Process to one Kernel Thread."],
      "correctOptionIndex": 1,
      "modelAnswer": "The One-to-One model provides excellent concurrency by mapping each user-level thread directly to a kernel-level thread.",
      "sourceReference": "Section: Kernel Mapping Models"
    },
    {
      "questionId": "mcq-004",
      "type": "MCQ",
      "text": "Which synchronization primitive ensures that only one thread can access a critical section at a time?",
      "difficulty": "Medium",
      "options": ["Condition Variable", "Semaphore", "Mutex Lock", "Process ID"],
      "correctOptionIndex": 2,
      "modelAnswer": "A Mutex (Mutual Exclusion) Lock is used to enforce that only one thread can hold the lock and access shared data.",
      "sourceReference": "Section: Thread Synchronization"
    },
    {
      "questionId": "mcq-005",
      "type": "MCQ",
      "text": "A key benefit of multithreading related to CPU usage is:",
      "difficulty": "Easy",
      "options": ["Increased virtual memory size.", "Improved file system encryption.", "Scalability on multicore architectures.", "Reduced I/O latency."],
      "correctOptionIndex": 2,
      "modelAnswer": "Multithreading allows an application to scale by running threads in parallel across multiple CPU cores.",
      "sourceReference": "Section: Benefits of Multithreading"
    },

    // --- Short Answer Questions (SAQ) ---
    {
      "questionId": "saq-001",
      "type": "SAQ",
      "text": "Briefly explain the major drawback of using User-Level Threads (ULT) regarding blocking system calls.",
      "difficulty": "Medium",
      "modelAnswer": "If a User-Level Thread (ULT) executes a blocking system call (e.g., waiting for I/O), the entire process, including all other ULTs within it, will be blocked because the kernel is unaware of the individual user threads.",
      "sourceReference": "Section: Types of Threads"
    },
    {
      "questionId": "saq-002",
      "type": "SAQ",
      "text": "What are the two components of a thread that are private to the thread and not shared with others in the same process?",
      "difficulty": "Medium",
      "modelAnswer": "The two primary private components are the Program Counter (PC) and the thread's own Stack. These must be unique to maintain the thread's independent execution path.",
      "sourceReference": "Section: Components of a Thread"
    },
    {
      "questionId": "saq-003",
      "type": "SAQ",
      "text": "Define 'Race Condition' in the context of multithreading.",
      "difficulty": "Medium",
      "modelAnswer": "A race condition occurs when multiple threads attempt to access and modify shared data concurrently, and the final output depends on the non-deterministic order in which the threads complete their operations.",
      "sourceReference": "Section: Thread Synchronization"
    },
    
    // --- Long Answer Questions (LAQ) ---
    {
      "questionId": "laq-001",
      "type": "LAQ",
      "text": "Compare and contrast the Many-to-One and One-to-One kernel mapping models in terms of efficiency, parallel execution capability, and overhead.",
      "difficulty": "Hard",
      "modelAnswer": "Many-to-One is highly efficient in terms of thread creation and context switching overhead (since the kernel is only managing one KLT), but it lacks true parallelism and suffers from the blocking problem. One-to-One offers true parallelism across multiple CPU cores and prevents a single thread block from halting the process, but it incurs high overhead because every user thread requires a dedicated kernel object.",
      "sourceReference": "Section: Kernel Mapping Models"
    },
    {
      "questionId": "laq-002",
      "type": "LAQ",
      "text": "Explain how the concept of 'Responsiveness' is achieved through multithreading, providing a common software example.",
      "difficulty": "Hard",
      "modelAnswer": "Responsiveness is achieved because multithreading allows parts of an application to continue executing even if another part is blocked or busy. For example, in a word processor, if one thread initiates a long-running print job or file save operation, another thread manages the graphical user interface (GUI), ensuring the user can still scroll, type, or interact with menus without the application freezing.",
      "sourceReference": "Section: Benefits of Multithreading"
    }
  ]
};