--
-- PostgreSQL database dump
-- Database: task_management
--

-- DROP DATABASE IF EXISTS task_management;
-- CREATE DATABASE task_management;

\connect task_management

--
-- PostgreSQL database dump complete
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA IF NOT EXISTS public;

ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);

ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);

ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.tasks (
    task_id bigint NOT NULL,
    user_id bigint NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    status character varying(255) DEFAULT 'To Do'::character varying NOT NULL,
    deadline date NOT NULL,
    created_by bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT tasks_status_check CHECK (((status)::text = ANY ((ARRAY['To Do'::character varying, 'In Progress'::character varying, 'Done'::character varying])::text[])))
);

ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: tasks_task_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE IF NOT EXISTS public.tasks_task_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.tasks_task_id_seq OWNER TO postgres;

--
-- Name: tasks_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_task_id_seq OWNED BY public.tasks.task_id;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.users (
    user_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);

ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE IF NOT EXISTS public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;

--
-- Name: tasks task_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN task_id SET DEFAULT nextval('public.tasks_task_id_seq'::regclass);

--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);

--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);

--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);

--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (task_id);

--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);

--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);

--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX IF NOT EXISTS sessions_user_id_index ON public.sessions USING btree (user_id);

--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX IF NOT EXISTS sessions_last_activity_index ON public.sessions USING btree (last_activity);

--
-- Name: tasks tasks_created_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_created_by_foreign FOREIGN KEY (created_by) REFERENCES public.users(user_id) ON DELETE CASCADE;

--
-- Name: tasks tasks_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;

--
-- Data untuk Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

-- Password: password (bcrypt hash)
INSERT INTO public.users (user_id, name, username, email, email_verified_at, password, remember_token, created_at, updated_at) VALUES
(1, 'Test User', 'testuser', 'test@example.com', '2024-01-01 00:00:00', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- Reset sequence
SELECT setval('public.users_user_id_seq', 1, true);

--
-- Data untuk Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tasks (task_id, user_id, title, description, status, deadline, created_by, created_at, updated_at) VALUES
(1, 1, 'Setup Project', 'Setup initial project structure and configuration', 'Done', '2024-01-15', 1, '2024-01-01 10:00:00', '2024-01-15 14:30:00'),
(2, 1, 'Implement Authentication', 'Implement JWT authentication for user login and registration', 'Done', '2024-01-20', 1, '2024-01-02 09:00:00', '2024-01-20 16:00:00'),
(3, 1, 'Create Task Management API', 'Build RESTful API for CRUD operations on tasks', 'In Progress', '2024-02-01', 1, '2024-01-03 11:00:00', '2024-01-25 10:00:00'),
(4, 1, 'Build Frontend UI', 'Create React components for task management interface', 'In Progress', '2024-02-05', 1, '2024-01-04 08:00:00', '2024-01-26 15:00:00'),
(5, 1, 'Add Filter and Sort Features', 'Implement filtering by status and sorting by deadline', 'To Do', '2024-02-10', 1, '2024-01-05 13:00:00', '2024-01-05 13:00:00'),
(6, 1, 'Write Documentation', 'Create comprehensive README and API documentation', 'To Do', '2024-02-15', 1, '2024-01-06 10:00:00', '2024-01-06 10:00:00'),
(7, 1, 'Testing and Bug Fixes', 'Perform thorough testing and fix any bugs found', 'To Do', '2024-02-20', 1, '2024-01-07 14:00:00', '2024-01-07 14:00:00'),
(8, 1, 'Deploy to Production', 'Deploy application to production environment', 'To Do', '2024-02-25', 1, '2024-01-08 09:00:00', '2024-01-08 09:00:00');

-- Reset sequence
SELECT setval('public.tasks_task_id_seq', 8, true);

--
-- PostgreSQL database dump complete
--

