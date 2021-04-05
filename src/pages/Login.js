import React, { useState, useEffect } from "react";
import logo from "../logo.png";
import "../bootstrap/login.css";

const Login = () => {
  return (
    <main class="form-signin">
      <form>
        <img class="mb-4" src={logo}></img>
        <h1 class="h3 mb-5 fw-normal text-center">로그인 해주세요</h1>
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

        <button class="w-100 btn btn-lg btn-primary" type="submit">
          로그인
        </button>
      </form>
    </main>
  );
};

export default Login;
