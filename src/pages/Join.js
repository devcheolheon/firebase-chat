import React, { useState, useEffect } from "react";
import styles from "../bootstrap/join.module.css";

const Join = () => {
  return (
    <main className={styles.join}>
      <form>
        <h1 class="h3 mb-3 fw-normal">가입하기</h1>
        <div class="form-floating">
          <input
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label for="floatingInput">이메일</label>
        </div>
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
          />
          <label for="floatingPassword">비밀번호</label>
        </div>
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label for="floatingInput">닉네임</label>
        </div>

        <button class="w-100 btn btn-lg btn-primary" type="submit">
          가입
        </button>
      </form>
    </main>
  );
};

export default Join;
