import React from 'react'

const content = `<div
  style="
    background-color: white; 
    color: #333; 
    padding: 45px; 
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); /* Soft light shadow */
    border: 1px solid #ddd;
  "
>

  <!-- Title -->
  <h1 
    style="
        color: #0056b3; 
        font-size: 2.5em; 
        border-bottom: 3px solid #0056b3; 
        padding-bottom: 15px; 
        margin-bottom: 30px;
    "
  >
    Understanding Threads: The Backbone of Concurrent Operating Systems
  </h1>

  <!-- Introduction Section -->
  <section style="margin-bottom: 30px;">
    <p style="line-height: 1.7; margin-bottom: 15px;">
      In modern computing, achieving high performance and responsiveness requires executing multiple tasks concurrently. The primary mechanism used by Operating Systems (OS) to achieve this concurrency is the <strong>Thread</strong>. While a process provides a complete environment for a program, a thread represents a single sequence of execution within that program.
    </p>
  </section>

  <!-- What is a Thread? -->
  <h2 
    style="
      color: #1a73e8; 
      font-size: 1.8em; 
      margin-top: 30px; 
      border-left: 5px solid #1a73e8; 
      padding-left: 15px; 
      margin-bottom: 20px;
    "
  >
    What is a Thread? (Lightweight Process)
  </h2>
  <p style="line-height: 1.7; margin-bottom: 20px;">
    A thread is often called a "lightweight process." It is the fundamental unit of CPU utilization. A process can contain multiple threads, and these threads share the resources of the parent process, such as memory space (code, data, and files). This shared resource model is what makes threads highly efficient for parallel execution.
  </p>

  <div style="border: 1px dashed #ccc; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
    <h3 style="color: #444; margin-top: 0; font-size: 1.2em;">Key Distinction: Process vs. Thread</h3>
    <ul style="list-style-type: none; padding-left: 0;">
      <li style="margin-bottom: 10px;"><strong style="color: #2a64a3;">Process:</strong> Owns resources (memory, files). Requires significant overhead for creation and context switching.</li>
      <li style="margin-bottom: 0;"><strong style="color: #2a64a3;">Thread:</strong> Shares resources. Creation and context switching are fast, making it ideal for concurrency within a single application.</li>
    </ul>
  </div>

  <!-- Components of a Thread -->
  <h2 
    style="
      color: #1a73e8; 
      font-size: 1.8em; 
      margin-top: 40px; 
      border-left: 5px solid #1a73e8; 
      padding-left: 15px; 
      margin-bottom: 20px;
    "
  >
    Components of a Thread
  </h2>
  <p style="line-height: 1.7;">
    Each thread possesses its own state information that allows it to execute independently:
  </p>
  <ul style="padding-left: 30px; line-height: 1.7;">
    <li style="margin-bottom: 8px;"><strong style="color: #2a64a3;">Thread ID:</strong> A unique identifier.</li>
    <li style="margin-bottom: 8px;"><strong style="color: #2a64a3;">Program Counter (PC):</strong> Points to the next instruction to be executed.</li>
    <li style="margin-bottom: 8px;"><strong style="color: #2a64a3;">Register Set:</strong> Used to hold current working variables.</li>
    <li style="margin-bottom: 8px;"><strong style="color: #2a64a3;">Stack:</strong> Contains execution history, local variables, and return addresses. (This is the thread's private stack).</li>
  </ul>
  <p style="margin-top: 15px; line-height: 1.7;">
    All threads belonging to the same process share the heap, code section, and data section.
  </p>

  <!-- Benefits of Multithreading -->
  <h2 
    style="
      color: #1a73e8; 
      font-size: 1.8em; 
      margin-top: 40px; 
      border-left: 5px solid #1a73e8; 
      padding-left: 15px; 
      margin-bottom: 20px;
    "
  >
    Benefits of Multithreading
  </h2>
  <ol style="padding-left: 30px; line-height: 1.7;">
    <li style="margin-bottom: 10px;"><strong style="color: #0056b3;">Responsiveness:</strong> Allows an application to continue running even if part of it is blocked or performing a long operation (e.g., a GUI remains interactive while printing).</li>
    <li style="margin-bottom: 10px;"><strong style="color: #0056b3;">Resource Sharing:</strong> Threads automatically share the memory and resources of their process, simplifying development and data access.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #0056b3;">Economy:</strong> It is much more economical to create and context-switch threads than processes.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #0056b3;">Scalability:</strong> Threads can run in parallel on multicore processor architectures, dramatically increasing throughput.</li>
  </ol>

  <!-- Types of Threads -->
  <h2 
    style="
      color: #1a73e8; 
      font-size: 1.8em; 
      margin-top: 40px; 
      border-left: 5px solid #1a73e8; 
      padding-left: 15px; 
      margin-bottom: 20px;
    "
  >
    Types of Threads
  </h2>
  
  <p style="line-height: 1.7;">Threads can be implemented at two main levels, each offering different performance characteristics:</p>

  <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
    <thead style="background-color: #e0eaff; color: #0056b3;">
      <tr>
        <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Feature</th>
        <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">User-Level Threads (ULT)</th>
        <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Kernel-Level Threads (KLT)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background-color: #f9f9f9;">
        <td style="padding: 12px; border: 1px solid #ddd;">Management</td>
        <td style="padding: 12px; border: 1px solid #ddd;">Managed by the user-level thread library (e.g., Pthreads). The OS is unaware.</td>
        <td style="padding: 12px; border: 1px solid #ddd;">Managed by the Operating System kernel.</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd;">Speed</td>
        <td style="padding: 12px; border: 1px solid #ddd;">Fast context switching; no kernel involvement needed.</td>
        <td style="padding: 12px; border: 1px solid #ddd;">Slower context switching due to kernel intervention.</td>
      </tr>
      <tr style="background-color: #f9f9f9;">
        <td style="padding: 12px; border: 1px solid #ddd;">Blocking</td>
        <td style="padding: 12px; border: 1px solid #ddd; color: #a00;">If one ULT blocks (e.g., for I/O), the entire process blocks.</td>
        <td style="padding: 12px; border: 1px solid #ddd;">If one KLT blocks, the kernel can schedule another thread from the same process.</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd;">Parallelism</td>
        <td style="padding: 12px; border: 1px solid #ddd;">Cannot utilize multiple CPU cores simultaneously.</td>
        <td style="padding: 12px; border: 1px solid #ddd;">Can run truly in parallel across multiple CPU cores.</td>
      </tr>
    </tbody>
  </table>

  <!-- Multithreading Models -->
  <h2 
    style="
      color: #1a73e8; 
      font-size: 1.8em; 
      margin-top: 40px; 
      border-left: 5px solid #1a73e8; 
      padding-left: 15px; 
      margin-bottom: 20px;
    "
  >
    Kernel Mapping Models
  </h2>
  <p style="line-height: 1.7;">
    The relationship between User-Level Threads (ULT) and Kernel-Level Threads (KLT) is defined by three primary multithreading models:
  </p>
  <ul style="padding-left: 30px; line-height: 1.7; margin-top: 15px;">
    <li style="margin-bottom: 10px;"><strong style="color: #2a64a3;">Many-to-One:</strong> Maps many ULTs to a single KLT. Efficient but suffers from the blocking problem (if one ULT blocks, the whole process blocks).</li>
    <li style="margin-bottom: 10px;"><strong style="color: #2a64a3;">One-to-One:</strong> Maps each ULT to a separate KLT. Excellent concurrency and parallel performance, but high overhead as every user thread requires a kernel object. (Used in Windows, Linux).</li>
    <li style="margin-bottom: 10px;"><strong style="color: #2a64a3;">Many-to-Many:</strong> Allows many ULTs to be mapped to a smaller or equal number of KLTs. Offers a balance, allowing the OS to create sufficient KLTs for parallel execution while allowing the application to create many ULTs cheaply.</li>
  </ul>

  <!-- Synchronization (Critical Importance) -->
  <h2 
    style="
      color: #cc0000; /* Use a slight warning color for critical topics */
      font-size: 1.8em; 
      margin-top: 40px; 
      border-left: 5px solid #cc0000; 
      padding-left: 15px; 
      margin-bottom: 20px;
    "
  >
    The Challenge: Thread Synchronization
  </h2>
  <p style="line-height: 1.7;">
    Since threads share memory space, running them concurrently introduces the risk of race conditions, where the final result depends on the non-deterministic order of execution. 
  </p>
  <p style="line-height: 1.7;">
    Thread synchronization mechanisms are essential to ensure data consistency and integrity. Key tools include:
  </p>
  <ul style="padding-left: 30px; line-height: 1.7; margin-top: 15px;">
    <li style="margin-bottom: 8px;"><strong>Mutex Locks:</strong> Only one thread can hold the lock at a time, ensuring mutual exclusion in a critical section.</li>
    <li style="margin-bottom: 8px;"><strong>Semaphores:</strong> A signaling mechanism that allows threads to wait for certain conditions to become true.</li>
    <li style="margin-bottom: 8px;"><strong>Condition Variables:</strong> Used to block a thread until a specific condition is met by another thread.</li>
  </ul>

</div>`; 

const Learn = () => {
  return (
    <div
      // Optional: Add a dark background wrapper for context
      className="bg-black min-h-screen "
    >
      <div dangerouslySetInnerHTML={{__html: content}} />
    </div>
  );
}

export default Learn